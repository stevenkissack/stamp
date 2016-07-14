# Stamp
Visual component based HTML builder

Features:
 - AngularJS powered
 - [ ] Ng-model two way binding, dirty and change events supported
 - [x] Bootstrap classes
 - [ ] Responsive
 - [x] Generate HTML
 - [-] Keyboard shortcuts (Enter key binding for new text component done)
 - [ ] Best guess HTML & Word importing (plugin based)
 - [x] Support for component extensions
 - [-] Text formatting (Currently only via textAngular component)
 - [ ] Test framework
 - [x] HTML Input (Via textAngular component for now)
 - [ ] Read-only structures
 - [ ] Documentation
 - [ ] NPM published

## Visual Stack Of Stamp

```
Stamp
│   @locked
│   @readOnly    
│
└───Stack
    │   
    └───Blocks []
        │   @layout 
        │       @maxColumns
        │   
        └───Columns []
            │
            └───Components []
```

## Additional Required Styles

This editor is currently reliant on Bootstrap being on the end website to work, this is so we lose a lot of inline styles usually seen on sites using WYSIWYGs. Though with a small amount of work I don't see why this dependancy couldn't be removed

When using the image component and setting the sizes you will notice that outside of Stamp these will not work. In order to correctly float and size images and optional captions you will need to add something similar to this:
```
/* Feel free to then control this further with media queries */
.width-25 { width: 25%; }
.width-50 { width: 50%; }
.width-75 { width: 75%; }
.width-100 { width: 100%; }
```
*If you know a better way to handle this I am happy to discuss, or simply override the image component for your own use*