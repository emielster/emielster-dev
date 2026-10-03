---
title: "Test"
date: "27-09-2026"
---
If you see this, blogging is successfully set up on my website.

**Bold**

*Italic*

> Indented

`Code`

```txt
Code block
Code block
Code block
```

# Testing several languages
```c
#include <stdio.h>

int main(void) {
	char* msg = "Hello, world!";
	printf("%s", msg);
	return 0;
}
```
---

```rust
fn main() {
	println!("Hello, world!");
}
```
---

```cpp
#include <iostream>
int main() {
	std::cout << "Hello, world" << std::endl;
	return 0;
}
```

---
```python
print("Hello, world!")
```
---
```js
console.log("Hello, world!");
```
---
```bash
echo "Hello, world!"
```
---
```x86_64-asm
global _start

section .text
_start:
	mov rax, 1
	mov rdi, 1 
	mov rsi, msg 
	mov rdx, msglen
	syscall
	
	mov rax, 60
	mov rdi, 0
	syscall

section .rodata
	msg: db "Hello, world", 10
	msglen: equ $ - msg
```
