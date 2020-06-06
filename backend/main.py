import uvicorn
from typing import Dict
from fastapi import FastAPI, HTTPException
from service import ImageService

app = FastAPI()

service_map = {
    'kusama': ImageService(network='kusama'),
    # add more services if memory allows it
}


@app.post("/{network}")
async def root(network: str, body: Dict[str, float]):
    service = service_map.get(network)
    if service:
        addresses = list(body.keys())
        balances = list(body.values())
        return await service.get_images(addresses, balances)
    else:
        raise HTTPException(status_code=404, detail=f'network "{network}" not found')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3141)
