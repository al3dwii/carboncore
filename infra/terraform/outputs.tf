output "backend_url" {
  value = helm_release.backend.name
}

output "frontend_url" {
  value = helm_release.frontend.name
}
