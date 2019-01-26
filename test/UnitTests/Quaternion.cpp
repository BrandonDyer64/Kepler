#include <Math/Vectors/Quaternion.h>
#include "../UnitTest.h"
#include <iostream>

using Kepler::Quaternion;
using Kepler::Vec3;

void TestQuaternion(){
  /*
  std::cout << "--QUATERNION--" << std::endl;
  Vec3 i(1,0,0), j(0,1,0), k(0,0,1);
  Quaternion axi = Quaternion::FromAxis(i, 90);
  std::cout << axi << std::endl;
  Quaternion vect = Quaternion::FromVectors(j,k);
  std::cout << vect << " ?= " << axi << std::endl;
  Quaternion euler = Quaternion::FromEuler(0,0,90);
  std::cout << euler << " ?= " << Quaternion::FromAxis(j,90) << std::endl;
  */

  UnitTest("Quaternion",
    Promise([](Promise &promise){
      Vec3 i(1,0,0), j(0,1,0), k(0,0,1);
      Quaternion axi = Quaternion::FromAxis(i, 90);
      Quaternion vec = Quaternion::FromVectors(j, k);
      if (vec != axi){
        std::cout << "Error FromVectors not returning proper value"  << std::endl;
        std::cout << "FromVectors " << vec << std::endl;
        std::cout << "FromAxis " << axi << std::endl;
        promise.Reject();
        return;
      }
      else{
        promise.Resolve(nullptr);
        return;
      }
    })
    .PThen(int, a, {
      return nullptr;
    })
  );
}
