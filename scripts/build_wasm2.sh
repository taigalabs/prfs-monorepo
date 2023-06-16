rm -rf ./source/prfs_wasm/build &&

cd ./source/prfs_wasm &&

wasm-pack build --target web --out-dir ../prfs_wasm/build
