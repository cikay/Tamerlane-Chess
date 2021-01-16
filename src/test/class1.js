class Person {
  constructor() {}
  printClassName() {
    console.log(`Person`)
  }
}

class Employee extends Person {
  constructor() {
    super()
  }
  printClassName() {
    super.printClassName()
    console.log(`Employee`)
  }
}

const emp = new Employee()
emp.printClassName()

// class Foo {
//   method() {
//     console.log('foor method')
//   }
// }

// class Bar extends Foo {
//   method() {
//     super.method()
//     console.log("bar method")
//   }
// }
// const bar = new Bar()
// bar.method()
