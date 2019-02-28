#ifndef COMPONENT_H
#define COMPONENT_H

#include <string>

namespace Kepler {
  /**
   * A tag class. All components in the system must extend this class.
   */
  class Component {
  public:
    virtual ~Component() = 0;
  protected:
    Component() {};
    Component(std::string params[], int count) {};
  };

};

#endif
