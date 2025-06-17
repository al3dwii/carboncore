resource "helm_release" "backend" {
  name       = "carboncore-backend"
  chart      = "oci-charts/carboncore-backend"
  repository = "oci://ghcr.io/your-org/charts"
  namespace  = "carboncore"
}
