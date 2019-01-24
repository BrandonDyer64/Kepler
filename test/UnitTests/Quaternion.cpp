#include <Math/Vectors/Quaternion.h>
#include <iostream>

using Kepler::Quaternion;
using Kepler::Vec3;

void TestQuaternion(){
  std::cout << "--QUATERNION--" << std::endl;
  Vec3 i(1,0,0), j(0,1,0), k(0,0,1);
  Quaternion axi = Quaternion::FromAxis(i, 90);
  std::cout << axi << std::endl;
  Quaternion vect = Quaternion::FromVectors(j,k);
  std::cout << vect << " ?= " << axi << std::endl;
  Quaternion euler = Quaternion::FromEuler(0,0,90);
  std::cout << euler << " ?= " << Quaternion::FromAxis(j,90) << std::endl;
}
