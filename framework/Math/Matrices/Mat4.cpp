#include "Mat4.h"
#include "../Generic/Conversions.h"
#include <cmath>

namespace Kepler {

Mat4::Mat4() {
	for (int i = 0; i < 4 * 4; i++) {
		elements[i] = 0.0f;
	}
}

Mat4::Mat4(float diagonal) {
	for (int i = 0; i < 4 * 4; i++) {
		elements[i] = 0.0f;
	}

	elements[0 + 0 * 4] = diagonal;
	elements[1 + 1 * 4] = diagonal;
	elements[2 + 2 * 4] = diagonal;
	elements[2 + 3 * 4] = diagonal;
}

Mat4 Mat4::Identity() { return Mat4(1.0f); }

Mat4 Mat4::Orthographic(float left, float right, float bottom, float top, float near, float far) {
	Mat4 result;

	result.elements[0 + 0 * 4] =  2.0f / (right - left);
	result.elements[1 + 1 * 4] =  2.0f / (top - bottom);
	result.elements[2 + 2 * 4] = -2.0f / (far - near);

	result.elements[0 + 3 * 4] = -((right + left) / (right - left));
	result.elements[1 + 3 * 4] = -((top + bottom) / (top - bottom));
	result.elements[2 + 3 * 4] = -((far + near) / (far - near));
	result.elements[3 + 3 * 4] = 1.0f;

	return result;
}
Mat4 Mat4::Perspective(float fov, float aspectRatio, float near, float far) {
	Mat4 result(1.0f);

	float q = 1.0f / std::tan(ToRadians(0.5f * fov));
	float a = q / aspectRatio;
	float b = (near + far) / (near - far);
	float c = (2.0f * near * far) / (near - far);

	result.elements[0 + 0 * 4] =  a;
	result.elements[1 + 1 * 4] =  q;
	result.elements[2 + 2 * 4] =  b;
	result.elements[3 + 2 * 4] =  -1.0f;
	result.elements[2 + 3 * 4] =  c;


	return result;
}

Mat4 Mat4::Translate(const Vec3& translation) {
	Mat4 result(1.0f);

	result.elements[0 + 3 * 4] = translation.x;
	result.elements[1 + 3 * 4] = translation.y;
	result.elements[2 + 3 * 4] = translation.z;

	return result;
}
Mat4 Mat4::Rotatate(const Quaternion& quat) {
	Mat4 result;

	float i = quat.x;
	float j = quat.y;
	float k = quat.z;
	float r = quat.w;

	/*
    			  			 x      y       z       w
	Quaternion q = (qr) + (qi)i + (qj)j + (qk)k

	   ┌		                                                     ┐
     | 1-2s(qj^2 + qk^2)	 2s(qiqj - qkqr)    2s(qiqk + qjqr)  |
	R =|  2s(qiqj + qkqr)	  1-2s(qi^2 + qk^2)   2s(qjqk - qiqr)  |
	   |  2s(qiqk - qjqr)	   2s(qjqk + qiqr)   1-2s(qi^2 + qj^2) |
   	 └		                                                     ┘

		 s = ||q||^(-2) but if q is a unit quaternion, then s = 1
	*/

	result.elements[0 + 0 * 4] = 1 - 2*(std::pow(j,2) + std::pow(k,2));
	result.elements[1 + 0 * 4] = 2 * (i*j - k*r);
	result.elements[2 + 0 * 4] = 2 * (i*k + j*r);

	result.elements[0 + 1 * 4] = 2 * (i*j + k*r);
	result.elements[1 + 1 * 4] = 1 - 2*(std::pow(i,2) + std::pow(k,2));
	result.elements[2 + 1 * 4] = 2 * (j*k - i*r);

	result.elements[0 + 2 * 4] = 2 * (i*k - j*r);
	result.elements[1 + 2 * 4] = 2 * (j*k + i*r);
	result.elements[2 + 2 * 4] = 1 - 2*(std::pow(i,2) + std::pow(j,2));

	result.elements[3 + 3 * 4] = 1;

	return result;
}
Mat4 Mat4::Scale(const Vec3& scaleRatio) {
	Mat4 result;

	result.elements[0 + 0 * 4] = scaleRatio.x;
	result.elements[1 + 1 * 4] = scaleRatio.y;
	result.elements[2 + 2 * 4] = scaleRatio.z;
	result.elements[3 + 3 * 4] = 1.0f;

	return result;
}

Mat4& Mat4::Multiply(const Mat4& other) {

	for (int y = 0; y < 4; y++) {
		for (int x = 0; x < 4; x++) {
			float sum = 0.0f;
			for (int e = 0; e < 4; e++) {
				sum += elements[x + e * 4] * other.elements[e + y * 4];
			}
			elements[x + y * 4] = sum;
		}
	}
	return *this;
}
Mat4 operator*(Mat4 left, const Mat4& right) { return left.Multiply(right); }
Mat4& Mat4::operator*=(const Mat4& other) { return Multiply(other); }

}
