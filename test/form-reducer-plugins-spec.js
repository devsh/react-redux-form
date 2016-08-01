import { assert } from 'chai';
import { actions, formReducer } from '../src';
import updateField from '../src/utils/update-field';

describe('formReducer plugins', () => {
  describe('customizing initialFieldState', () => {
    const plugin = (state, action, localPath) => {
      if (action.type === 'CHANGE_STATUS') {
        return updateField(state, localPath, { status: action.status });
      }

      return state;
    };

    const reducer = formReducer('test', { foo: 'bar' }, {
      plugins: [plugin],
      initialFieldState: { status: 'disabled' },
    });

    it('should be able to "extend" the initialFieldState', () => {
      const actual = reducer(undefined, { type: 'bogus' });

      assert.equal(actual.$form.status, 'disabled');
      assert.equal(actual.foo.status, 'disabled');
    });

    it('should be able to persist initialFieldState', () => {
      const actual1 = reducer(undefined, actions.change('foo', 'one'));
      const actual2 = reducer(actual1, actions.change('foo', 'two'));

      assert.equal(actual2.$form.status, 'disabled');
      assert.equal(actual2.foo.status, 'disabled');
    });

    it('should use the plugin with custom actions', () => {
      const action = {
        type: 'CHANGE_STATUS',
        model: 'test.foo',
        status: 'enabled',
      };
      const actual = reducer(undefined, action);

      assert.equal(actual.$form.status, 'disabled');
      assert.equal(actual.foo.status, 'enabled');
    });
  });
});
