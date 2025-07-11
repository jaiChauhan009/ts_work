import { Message } from '@terradharitri/sdk-core/out';
import { PendingTransactionsEventsEnum } from 'core/managers/internal/PendingTransactionsStateManager/types/pendingTransactions.types';
import { SigningWarningsEnum } from 'types/enums.types';
import { getPendingTransactionsHandlers } from '../getPendingTransactionsHandlers';

type SignMessageWithModalPropsType<T> = {
  message: Message;
  handleSignMessage: (message: Message) => Promise<Message>;
  cancelAction?: () => Promise<T> | undefined;
  providerType: string;
};

export async function signMessage<T>({
  message,
  handleSignMessage,
  cancelAction,
  providerType
}: SignMessageWithModalPropsType<T>): Promise<Message> {
  const signedMsg = await new Promise<Awaited<Message>>(
    async (resolve, reject) => {
      const { eventBus, manager, onClose } =
        await getPendingTransactionsHandlers({
          cancelAction
        });

      const handleClose = async () => {
        await onClose({ shouldCancelAction: false });
        reject({ message: SigningWarningsEnum.cancelled });
      };

      eventBus.subscribe(
        PendingTransactionsEventsEnum.CLOSE_PENDING_TRANSACTIONS,
        handleClose
      );

      manager.updateData({
        isPending: true,
        title: 'Message Signing',
        subtitle: `Check your ${providerType} to sign the message`
      });

      try {
        const signedMessage = await handleSignMessage(message);
        resolve(signedMessage);
      } catch (err) {
        await onClose({ shouldCancelAction: true });
        reject(err);
      } finally {
        manager.closeAndReset();
        eventBus.unsubscribe(
          PendingTransactionsEventsEnum.CLOSE_PENDING_TRANSACTIONS,
          handleClose
        );
      }
    }
  );
  return signedMsg;
}
