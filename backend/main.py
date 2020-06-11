import uvicorn
from typing import Dict
from fastapi import FastAPI, HTTPException
from service import ImageService
import sys
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

service_map = {
    'kusama': ImageService(network='kusama'),
    'polkadot': ImageService(network='polkadot')
}


@app.post("/{network}")
async def addresses_to_images(network: str, body: Dict[str, float]):
    service = service_map.get(network)
    if service:
        addresses = list(body.keys())
        balances = list(body.values())
        response = await service.get_images(addresses, balances)
        return response
    else:
        raise HTTPException(status_code=404, detail=f'network "{network}" not found')


@app.get("/{network}/avatar/{block_height}")
async def get_avatar(network: str, block_height: int):
    service = service_map.get(network)
    if service:
        return await service.get_avatar(block_height)
    else:
        raise HTTPException(status_code=404, detail=f'network "{network}" not found')


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3141)
