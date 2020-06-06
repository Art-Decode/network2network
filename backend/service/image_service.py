from typing import Dict, List
from PIL import Image
from service.inference import StyleGAN2, Models
import numpy as np
from io import BytesIO
import base64
from service.ss58 import ss58_decode
from fastapi import HTTPException

_NETWORK_CONFIG = {
    'kusama': {
        'model_type': Models.anime,
        'balance_latent': np.ones((16, 512)),
        'balance_scale': lambda x: np.log(x)
    },
    'polkadot': {
        'model_type': Models.ffhq,
        'balance_latent': -np.ones((18, 512)),
        'balance_scale': lambda x: np.log2(x)
    }
}


class ImageService:
    def __init__(self, network: str):
        self.network = network
        self.GAN = StyleGAN2(model_type=_NETWORK_CONFIG[network]['model_type'],
                             balance_latent=_NETWORK_CONFIG[network]['balance_latent'])

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
        if count < 10:
            for _ in range(10-count):
                addresses.append(addresses[-1])
                balances.append(balances[-1])
        if count > 10:
            raise HTTPException(status_code=400, detail="Too many images requested")

        raw_images = self.GAN.generate_images(self.addresses_to_latent(addresses), balances)
        images = []
        for image in raw_images:
            image = Image.fromarray(image)
            buffered = BytesIO()
            image.save(buffered, format="JPEG")
            images.append(base64.b64encode(buffered.getvalue()))

        return dict(zip(addresses, images))
