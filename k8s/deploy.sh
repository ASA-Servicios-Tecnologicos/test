#!/usr/bin/env sh

com=$1
env=$2
sha=$3

if [[ $env == "production" ]] ; then
    export NAMESPACE="b2b"
else
    export NAMESPACE="dev"
fi


#envsubst ./k8s/$com/base/namespace.yaml | tee ./k8s/$com/base/namespace.yaml

tmpfile=$(mktemp)
cat ./k8s/$com/base/namespace.yaml| envsubst > "$tmpfile" && cp -pf "$tmpfile" ./k8s/$com/base/namespace.yaml
rm -f "$tmpfile"

rm -rf .dynamic-env && mkdir -p .dynamic-env && cd .dynamic-env

kustomize create --resources ../k8s/$com/env/$env
kustomize edit set image registrytecnob2b.azurecr.io/ota-backend:"$sha"
kustomize build . | kubectl apply -f - 
#kustomize build .