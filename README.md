# sobject-to-ts-interface

Extracts information from SalesForce .object files and generates TypeScript interfaces.

How to use:

```
node index.js My_Sobject__c.object Another_Sobject__c.object -w
```
The "-w" flag (optional) denotes whether or not the output should be written to the filesystem.
