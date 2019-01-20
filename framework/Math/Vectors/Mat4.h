#ifndef "Mat4_h"
#define "Mat4_h"

#define _USE_MATH_DEFINES
#include "Vec4.h"
#include "Quaternion.h"

//MATRICES ARE IN COLUMN MAJOR ORDER TO SUITE OPENGL
/*
┌		        ┐
| 1	5 9  13 |
| 2	6 10 14 |
| 3	7 11 15 |
| 4	8 12 16 |
└		        ┘
*/

namespace Kepler {
	struct Mat4 {
		union {
			struct { float elements[4 * 4]; };
			struct { Vec4 columns[4]; }
		};

	  Mat4();
		Mat4(float diagnal);

		static Mat4 Identity();
		static Mat4 Orthographic(float left, float right, float bottom, float top, float near, float far);
		static Mat4 Perspective(float fov, float aspectRatio, float near, float far);

		static Mat4 Translation(const Vec3& translation);
		static Mat4 Scale(const Vec3& scaleRatio);
		static Mat4 Rotation(const Quaternion& quat);

		Mat4& multiply(const Mat4& other);
		friend Mat4 operator*(Mat4 left, const Mat4& right);
		Mat4& operator*=(const Mat4& other);
	};
}
