import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { panel, text } from '@metamask/snaps-ui';

describe('onRpcRequest', () => {
  describe('hello', () => {
    it('shows a confirmation dialog', async () => {
      const { request } = await installSnap();

      const origin = 'Jest';
      const response = request({
        method: 'hello',
        origin,
      });

      const ui = await response.getInterface();
      expect(ui.type).toBe('confirmation');
      expect(ui).toRender(
        panel([
          text(`Hello, **${origin}**!`),
          text('This custom confirmation is just for display purposes.'),
          text(
            'But you can edit the snap source code to make it do something, if you want to!',
          ),
        ]),
      );

      await ui.ok();

      expect(await response).toRespondWith(true);
    });
  });

  it('throws an error if the requested method does not exist', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found.',
      stack: expect.any(String),
    });

    await close();
  });
});

describe('setState', () => {
  it('sets the state to the params', async () => {
    const { request, close } = await installSnap();

    expect(
      await request({
        method: 'setState',
        params: {
          items: ['foo'],
        },
      }),
    ).toRespondWith(true);

    expect(
      await request({
        method: 'getState',
      }),
    ).toRespondWith({
      items: ['foo'],
    });

    await close();
  });

  it('sets the unencrypted state to the params', async () => {
    const { request, close } = await installSnap();

    expect(
      await request({
        method: 'setState',
        params: {
          items: ['foo'],
          encrypted: false,
        },
      }),
    ).toRespondWith(true);

    expect(
      await request({
        method: 'getState',
      }),
    ).toRespondWith({
      items: [],
    });

    expect(
      await request({
        method: 'getState',
        params: {
          encrypted: false,
        },
      }),
    ).toRespondWith({
      items: ['foo'],
    });

    await close();
  });
});
