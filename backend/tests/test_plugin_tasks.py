from celery import Celery
from app.schemas.plugins import PluginManifest, Schedule
from app.tasks.loader import load_plugin_tasks
from app.registry import REGISTRY

# Module used for test plugin task
from tests.dummy_plugin import dummy_task


def test_load_plugin_tasks_registers():
    celery_app = Celery("test", broker="memory://", backend="cache+memory://")
    plugin = PluginManifest(
        id="dummy",
        schedules=[
            Schedule(name="dummy", task="tests.dummy_plugin:dummy_task")
        ],
    )
    original = REGISTRY.copy()
    try:
        REGISTRY['dummy'] = plugin
        load_plugin_tasks(celery_app)
        assert "dummy" in celery_app.tasks
    finally:
        REGISTRY.clear()
        REGISTRY.update(original)

