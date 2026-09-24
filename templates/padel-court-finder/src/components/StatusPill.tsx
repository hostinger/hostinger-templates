import { ClockIcon } from '../icons';
import { describeStatus, type OpenStatus } from '../utils/hours';

type StatusPillProps = {
  status: OpenStatus;
  large?: boolean;
};

export function StatusPill({ status, large = false }: StatusPillProps) {
  const classes = ['status', status.open ? 'status--open' : 'status--closed', large && 'status--large'];
  return (
    <span className={classes.filter(Boolean).join(' ')}>
      <ClockIcon width={large ? 20 : 16} height={large ? 20 : 16} />
      {describeStatus(status)}
    </span>
  );
}
