
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from smolagents import CodeAgent, DuckDuckGoSearchTool, HfApiModel

class CommandRequest(BaseModel):
    command: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = HfApiModel(token="api_key")

agent = CodeAgent(
    tools=[DuckDuckGoSearchTool()],
    model=model,
    additional_authorized_imports=[
        "selenium",
        "webdriver_manager.chrome",
        "selenium.webdriver.chrome.options",
        "selenium.webdriver.chrome.service",
        "selenium.webdriver.common.by",
        "selenium.webdriver.common.keys",
        "selenium.webdriver.common.utils",
        "selenium.webdriver.support.ui",
        "selenium.webdriver.support.wait",
        "selenium.webdriver.support.expected_conditions",
        "webdriver_manager",
        "webdriver_manager.chrome",
    ],
)

@app.post("/run-agent")
async def run_agent(request: CommandRequest):
    if not request.command:
        raise HTTPException(status_code=400, detail="Command is required")

    try:
        response = agent.run(request.command)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
