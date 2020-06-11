import dnnlib
import dnnlib.tflib as tflib
import numpy as np
import pickle
from dataclasses import dataclass
from typing import List, Callable

_Gs = None


@dataclass
class Model:
    name: str
    url: str

class Models:
    ffhq = Model(
        name="ffhq",
        url="http://d36zk2xti64re0.cloudfront.net/stylegan2/networks/stylegan2-ffhq-config-f.pkl",
    )
    anime = Model(
        name="anime",
        url="https://drive.google.com/u/0/uc?export=download&confirm=-E2N&id=1BHeqOZ58WZ-vACR2MJkh1ZVbJK2B-Kle",
    )


class StyleGAN2:
    transform = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)

    def __init__(self, truncation_psi: float = 0.7,
                 minibatch_size: int = 10,
                 model_type: 'Model' = Models.ffhq,
                 randomize: bool = False):
        self.truncation_psi = truncation_psi
        self.minibatch_size = minibatch_size
        self.model_type = model_type
        self.randomize = randomize

        tflib.init_tf()
        with dnnlib.util.open_url(model_type.url, cache_dir='/tmp') as f:
            _, _, self.inference_model = pickle.load(f, encoding='latin1')

    def generate_images_w_lat(self, w_lats: np.ndarray, lat_dir_scales: List[float], lat_dir: np.ndarray,
                              bias_random: Callable[[np.ndarray], np.ndarray]):
        for i in range(len(lat_dir_scales)):
            w_lats[i] = bias_random(w_lats[i])
            w_lats[i] += lat_dir*lat_dir_scales[i]
        return self.inference_model.components.synthesis.run(
            w_lats,
            randomize_noise=False,
            minibatch_size=self.minibatch_size,
            output_transform=self.transform
        )

    def generate_images(self, latents: np.ndarray, lat_dir_scales: List[float], lat_dir: np.ndarray,
                        bias_random: Callable[[np.ndarray], np.ndarray]):
        w_lats = self.inference_model.components.mapping.run(latents, None)
        for i in range(len(lat_dir_scales)):
            w_lats[i] = bias_random(w_lats[i])
            w_lats[i] += lat_dir*lat_dir_scales[i]
        return self.inference_model.components.synthesis.run(
            w_lats,
            randomize_noise=False,
            minibatch_size=self.minibatch_size,
            output_transform=self.transform
        )

