#!/bin/sh

mkdir -p build
cd build
cmake ..
make -j$((`nproc`+1))
