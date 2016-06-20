# Stamp
Visual component based HTML builder

Features:
 - AngularJS powered
 - [ ] Ng-model two way binding, dirty and change events supported
 - [ ] Bootstrap 4 classes
 - [ ] Responsive
 - [ ] Bi-directional translation of generated mark-up to HTML
 - [ ] Keyboard shortcuts
 - [ ] Debug parsing stack output
 - [ ] Best guess HTML & Word importing (plugin based)
 - [ ] Plugin support for mark-up extensions
 - [ ] Text formatting
 - [ ] Test framework
 - [ ] Raw code extracts
 - [ ] Read-only structures
 - [ ] Documentation
 - [ ] NPM published

## Visual Stack Of Elements / Classes

```
Stamp
│   @locked
│   @readOnly    
│
└───Stack
    │   
    └───Block
        │   @layout (Layout Class)
        │   
        └───Component
```