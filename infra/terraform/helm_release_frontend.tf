resource "helm_release" "frontend" {
  name       = "carboncore-frontend"
  chart      = "oci-charts/carboncore-frontend"
  repository = "oci://ghcr.io/your-org/charts"
  namespace  = "carboncore"
}
