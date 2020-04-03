var editor = new FroalaEditor('#felora__editor',{
    // Set custom buttons.
    heightMin: 100,
    heightMax: 150,
    quickInsertTags: null,
    direction: 'rtl',
    toolbarButtons: {
    // Key represents the more button from the toolbar.
    moreText: {
      // List of buttons used in the  group.
      buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],

      // Alignment of the group in the toolbar.
      align: 'right',

      // By default, 3 buttons are shown in the main toolbar. The rest of them are available when using the more button.
      buttonsVisible: 3
    },


    moreParagraph: {
      buttons: ['alignRight', 'alignCenter', 'alignLeft', 'formatOLSimple', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
      align: 'right',
      buttonsVisible: 3
    },

    moreRich: {
      buttons: ['insertLink',  'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly'],
      align: 'right',
      buttonsVisible: 3
    },

    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
      align: 'left',
      buttonsVisible: 2
    }
  },

    // Change buttons for XS screen.
    toolbarButtonsXS: [['undo', 'redo'], ['bold', 'italic', 'underline']]
  }, function () {
    
  })
// document.querySelector('#btn').addEventListener('click', ()=>{
//     // const content = document.querySelector('#example');
//     // const html = content.querySelector('#aa').innerHTML;
    
//     console.log(editor.html.get())

// })
