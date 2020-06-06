import dnnlib
import dnnlib.tflib as tflib
import numpy as np
import pickle
from typing import List

_Gs = None


class Model:
    def __init__(self, name, url, latent_size, output_shape, latents=None):
        self.name = name
        self.url = url
        self.latent_size = latent_size
        self.output_shape = output_shape
        self.latents = latents


class Models:
    ffhq = Model(
        name="ffhq",
        url="http://d36zk2xti64re0.cloudfront.net/stylegan2/networks/stylegan2-ffhq-config-f.pkl",
        latent_size=512,
        output_shape=(1024, 1024),
    )
    cars = Model(
        name="cars",
        url="https://drive.google.com/uc?id=1MhZpQAqgxKTz22u_urk0HSXA-BOLMCLV",
        latent_size=512,
        output_shape=(512, 384, 3)
    )
    cats = Model(
        name="cats",
        url="https://drive.google.com/uc?id=1MvGHMNicQjhOdGs94Zs7fw6D9F7ikJeO",
        latent_size=512,
        output_shape=(256, 256, 3)
    )
    churches = Model(
        name="churches",
        url="https://drive.google.com/uc?id=1N2g_buEUxCkbb7Bfpjbj0TDeKf1Vrzdx",
        latent_size=512,
        output_shape=(256, 256, 3)
    )
    horses = Model(
        name="horses",
        url="https://drive.google.com/uc?id=1N4lnXL3ezv1aeQVoGY6KBen185MTvWOu",
        latent_size=512,
        output_shape=(256, 256, 3)
    )
    anime = Model(
        name="anime",
        url="https://drive.google.com/u/0/uc?export=download&confirm=-E2N&id=1BHeqOZ58WZ-vACR2MJkh1ZVbJK2B-Kle",
        latent_size=512,
        output_shape=(512, 512, 3)
    )
    microcosmos = Model(
        name="microcosm",
        url="file:///tmp/StyleGAN2_microscopev1.pkl",
        # https://mega.nz/file/PbgzWTZT#JbVpqgMU7AOg-sQUoG1BDepuwKtgAsLgjd4YwlTXlpc
        latent_size=512,
        output_shape=(1024, 1024, 3)
    )
    wikiart = Model(
        name="wikiart",
        url="https://archive.org/download/wikiart-stylegan2-conditional-model/network-snapshot-012052.pkl",
        latent_size=512,
        output_shape=(512, 512, 3)
    )
    modernart = Model(
        name="modernart",
        url="file:///tmp/StyleGAN2_modernart.pkl",
        # https://mega.nz/file/TCgSVCTa#ZmcV381soxyqiQyHO4p60F5ogoHcaO1PqDF9ZuiHVQw
        latent_size=512,
        output_shape=(512, 512, 3)
    )


class StyleGAN2:
    transform = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)

    def __init__(self, truncation_psi: float = 0.7,
                 minibatch_size: int = 32,
                 model_type: 'Model' = Models.ffhq,
                 randomize: bool = False,
                 balance_latent: np.ndarray = np.zeros((18, 512))):
        self.truncation_psi = truncation_psi
        self.minibatch_size = minibatch_size
        self.model_type = model_type
        self.randomize = randomize
        self.balance_latent=balance_latent

        tflib.init_tf()
        with dnnlib.util.open_url(model_type.url, cache_dir='/tmp') as f:
            _, _, self.inference_model = pickle.load(f, encoding='latin1')

    def generate_images(self, latents: np.ndarray, balances_scaled: List[float]):
        res = self.inference_model.components.mapping.run(latents, None)
        for i in range(len(balances_scaled)):
            res[i] = res[i] + self.balance_latent*balances_scaled[i]
        return self.inference_model.components.synthesis.run(
            res,
            randomize_noise=False,
            minibatch_size=self.minibatch_size,
            output_transform=self.transform
        )

