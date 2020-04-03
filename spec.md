Over the wire
=====================

the following creates a pipe:

```
[
    {type: "resource", resourceName: "table-1"},
    {type: "op", operationName: "get", args: {key: "my-key"}} 
]
```

`type: "resource"` request an existing stream