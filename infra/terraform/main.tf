terraform {
  required_version = "~> 1.9"
  backend "s3" {
    bucket = "carboncore-state"
    key    = "prod/terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}
