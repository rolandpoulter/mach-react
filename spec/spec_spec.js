'use strict';

let { Describe, Assert, It } = window;

let example = (
  <Describe a="spec"
      before={() => console.log('before', this.value = true)}
      after={() => console.log('after', this)}
      before-each={() => console.log('before each')}
      after-each={() => console.log('after each')}>
    <It should="be able to assert">
      <Assert that="this value is:" pass="ok" fail="not ok" expect={$ => $(this.value).to.be.ok} />
    </It>
  </Describe>
);

setTimeout(() => {
  React.render(example, document.body);
}, 100)
