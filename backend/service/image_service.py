from typing import Dict, List, Callable
from PIL import Image
from service.inference import StyleGAN2, Models
import numpy as np
from io import BytesIO
import base64
from service.ss58 import ss58_decode
from fastapi import HTTPException

_MAX_IMAGES = 10


def _project_a_onto_b(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """
    project vector a onto vector b but only if there is a positive b component in a
    :param a:
    :param b:
    :return:
    """
    factor = np.dot(a.flatten(), b.flatten()) / np.dot(b.flatten(), b.flatten())
    if factor <= 0:
        return np.zeros((18, 512))
    else:
        return b * factor


def _layer_mask(start: int, end: int) -> np.ndarray:
    """
    return an array that can be multiplied with a w_latent that will mask out layers not in start->end
    :param start: first layer to still be included
    :param end: last layer to be included
    :return: layer mask
    """
    ones = np.ones((18, 512))
    ones[0:start] = 0
    ones[end + 1:] = 0
    return ones


def get_bias_random_vector_polkadot() -> Callable[[np.ndarray], np.ndarray]:
    smile = np.load('service/latents/smile.npy') * _layer_mask(4, 4)
    mouth_open = np.load('service/latents/mouth_open.npy') * _layer_mask(4, 4)
    mouth_size = np.load('service/latents/mouth_size.npy') * _layer_mask(4, 4)
    mouth_ratio = np.load('service/latents/mouth_ratio.npy') * _layer_mask(4, 4)

    def bias_random_vector_polkadot(w_lat: np.ndarray) -> np.ndarray:
        w_lat -= _project_a_onto_b(w_lat * _layer_mask(4, 4), mouth_size) * 2
        w_lat -= _project_a_onto_b(w_lat * _layer_mask(4, 4), mouth_open) * 2
        w_lat -= _project_a_onto_b(w_lat * _layer_mask(4, 4), smile) * 2
        return w_lat + mouth_ratio * 0.1

    return bias_random_vector_polkadot


def get_sigmoid_for_max_n(max_n: int) -> Callable[[float], float]:
    return lambda t: (1 / (1 + np.float_power(np.e, -t / 400000.)) - 0.5) * 2 * max_n


_NETWORK_CONFIG = {
    'kusama': {
        'model_type': Models.anime,
        'balance_latent': np.zeros((16, 512)),
        'balance_scale': lambda x: 1. / 10000 * 0.4 * x if x < 10000 else 0.4,
        'bias_random': lambda x: x,
        'block_height_latent': np.zeros((16, 512)),
        'block_height_scale': get_sigmoid_for_max_n(1),
        'avatar': np.load('service/avatars/kusama.npy')
    },
    'polkadot': {
        'model_type': Models.ffhq,
        'balance_latent': np.load('service/latents/smile.npy')*_layer_mask(4, 4),
        'balance_scale': lambda x: 1. / 1000000 * 0.4 * x if x < 1000000 else 0.4,
        'bias_random': get_bias_random_vector_polkadot(),
        'block_height_latent': np.load('service/latents/age.npy'),
        'block_height_scale': lambda x: get_sigmoid_for_max_n(1)(x) - 0.2,
        'avatar': np.load('service/avatars/polkadot.npy')
    }
}


class ImageService:
    def __init__(self, network: str):
        self.network = network
        self.GAN = StyleGAN2(model_type=_NETWORK_CONFIG[network]['model_type'])

    def addresses_to_latent(self, addresses: List[str]) -> np.ndarray:
        """
        Uses the raw integer value of the address as a seed for the numpy RNG
        NOTE: could raise an error if an address isn't valid
        :param addresses: Base58 encoded Substrate addresses
        :return: a numpy.ndarray with dimensions (n, 512)
        """
        return np.array([np.concatenate([np.random.RandomState(addr_byte).randn(16)
                                         for addr_byte in ss58_decode(address)])
                         for address in addresses])

    async def get_images(self, addresses: List[str], balances: List[float]) -> Dict[str, Image.Image]:
        count = len(addresses)
        if count < _MAX_IMAGES:
            for _ in range(_MAX_IMAGES - count):
                addresses.append(addresses[-1])
                balances.append(balances[-1])
        if count > _MAX_IMAGES:
            raise HTTPException(status_code=400, detail=f'Too many images requested, max: {_MAX_IMAGES}')

        raw_images = self.GAN.generate_images(self.addresses_to_latent(addresses),
                                              lat_dir_scales=[_NETWORK_CONFIG[self.network]['balance_scale'](balance)
                                                              for balance in balances],
                                              lat_dir=_NETWORK_CONFIG[self.network]['balance_latent'],
                                              bias_random=_NETWORK_CONFIG[self.network]['bias_random'])
        images = []
        for image in raw_images:
            image = Image.fromarray(image)
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            images.append(base64.b64encode(buffered.getvalue()))

        return dict(zip(addresses, images))

    async def get_avatar(self, block_height: int) -> dict:
        avatars = np.array([_NETWORK_CONFIG[self.network]['avatar'] for _ in range(_MAX_IMAGES)])
        lat_dir = _NETWORK_CONFIG[self.network]['block_height_latent']
        lat_dir_scales = [_NETWORK_CONFIG[self.network]['block_height_scale'](block_height) for _ in range(_MAX_IMAGES)]
        raw_image = self.GAN.generate_images_w_lat(avatars,
                                                    lat_dir_scales=lat_dir_scales,
                                                    lat_dir=lat_dir,
                                                    bias_random=lambda x: x)[0]
        image = Image.fromarray(raw_image)
        image = image.resize((512, 512))
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        return {'avatar': base64.b64encode(buffered.getvalue())}
