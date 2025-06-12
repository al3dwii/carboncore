from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

provider = TracerProvider(resource=Resource.create({SERVICE_NAME: "carboncore"}))
processor = BatchSpanProcessor(OTLPSpanExporter(endpoint="http://grafana-agent:4318"))
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

