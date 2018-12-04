#ifndef ReadFile_h
#define ReadFile_h

#include <iostream>
#include <string>
#include <vector>

namespace Kepler {

std::vector<char> ReadFile(const std::string &filename);

std::string ExecPath();

} // namespace Kepler

#endif
