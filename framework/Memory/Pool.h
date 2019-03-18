#ifndef Pool_h
#define Pool_h

#include <stdexcept>

namespace Kepler {

class PoolLink {
  PoolLink *next;
};

template <typename T>
class Pool {
private:
  int capacity = 0;
  int size = 0;
  const int cellSize = 0;
  T *next;

public:
  Pool(int capacity): capacity(capacity) {
    if (sizeof(T) < sizeof(T *)) {
      throw std::invalid_argument("Pool object must be larger than its pointer");
    }
    next = CreateBlock(capacity);
  }
  Pool(): capacity(128) {};

  // ##### Creation #####

  T *Alloc() {
    PoolLink *link = (PoolLink *) next;
    if (link->next == nullptr) {
      next = CreateBlock(capacity);
    } else {
      next = (T *) link->next;
    }
    size--;
    return (T *) link;
  }
  T &operator++() {
    return *Alloc();
  }
  T &operator<<(T original) {
    T *newLoc = Alloc();
    memcpy(newLoc, &original, sizeof(T));
    return *newLoc;
  }

  // ##### Deletion #####

  void Dealloc(T *object) {
    size--;
    PoolLink *link = (PoolLink *) object;
    link->next = next;
    next = (T *) link;
  }
  void operator>>(T &object) {
    Dealloc(&object);
  }

private:
  T *CreateBlock(int size) {
    capacity += size;
    T *first = new T[size];
    for (int i = 0; i < size - 1; i++) {
      PoolLink *link = (PoolLink *) first[i];
      link->next = (PoolLink *) first[i + 1];
    }
    ((PoolLink *)first[size-1])->next = nullptr;
    return first;
  }
};

}

#endif
