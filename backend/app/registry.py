from app.plugin_manifest import PluginManifest, Route

registry =  {'core': PluginManifest(id='core', event_types=[], routes=[Route(handler='app.routers.skus:router', path=None, method='GET', prefix=''), Route(handler='app.routers.carbon:router', path=None, method='GET', prefix=''), Route(handler='app.routers.events:router', path=None, method='GET', prefix=''), Route(handler='app.routers.tokens:router', path=None, method='GET', prefix='')], schedules=[])}
