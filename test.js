var assert = require('assert');
var spec = require('./spec.json');
var pathlib = require('./pathlib');

describe('pathlib', function() {
   var path;

   before(function() {
      path = pathlib(spec);
   });

   after(function() {
      path = null;
   });

   describe('#constructor()', function() {
      it('empty', function() {
         assert.equal('', path('') + '');
         assert.equal('', path([]) + '');
      });

      it('array', function() {
         var p = path([{name: 'Файл', index: null}, {name: 'Документ', index: null}, {name: 'Доверенность', index: null}]);
         assert.equal('Файл.Документ.Доверенность', p + '');
      });

      it('string', function() {
         var p = path('Файл.Документ.Доверенность');
         assert.equal('Файл.Документ.Доверенность', p + '');
      });
   });

   describe('#isValid()', function() {
      it('invalid', function() {
         assert(!path.isValid('Файл.Документ.Квитанция'));
      });

      it('valid', function() {
         assert(path.isValid('Файл.Документ.Доверенность'));
      });
   });

   describe('#fillMultiple()', function() {
      it('noindex', function() {
         assert.equal('Файл.Документ.Сотрудник[0].Телефон[0].Номер', path('Файл.Документ.Сотрудник.Телефон.Номер').fillMultiple());
      });

      it('index', function() {
         assert.equal('Файл.Документ.Сотрудник[1].Телефон[2].Номер', path('Файл.Документ.Сотрудник.Телефон[2].Номер').fillMultiple('1'));
      });
   });

   describe('#dropMultiple()', function() {
      it('noindex', function() {
         assert.equal('Файл.Документ.Сотрудник.Телефон.Номер', path('Файл.Документ.Сотрудник[0].Телефон[1].Номер').dropMultiple());
      });

      it('index', function() {
         assert.equal('Файл.Документ.Сотрудник.Телефон[1].Номер', path('Файл.Документ.Сотрудник[0].Телефон[1].Номер').dropMultiple(0));
         assert.equal('Файл.Документ.Сотрудник[0].Телефон.Номер', path('Файл.Документ.Сотрудник[0].Телефон[1].Номер').dropMultiple(-1));
      });
   });

   describe('#each()', function() {
      it('count', function() {
         var count = 0;
         path('Файл.Документ.Сотрудник[0].Телефон[1].Номер').each(function(obj) {
            count += 1;
            if (obj.name === 'Сотрудник') {
               return false;
            }
         });
         assert.equal(3, count);
      });
   });

   describe('#length', function() {
      it('simple', function() {
         assert.equal(5, path('Файл.Документ.Сотрудник[0].Телефон[1].Номер').length);
         assert.equal(4, path('Файл.Документ.Сотрудник[0].Телефон[1]').length);
         assert.equal(2, path('Файл.Документ').length);
      });
   });
});