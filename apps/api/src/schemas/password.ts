/**
 * Re-export shared password rules.
 * Frontend validates first; API uses the same schema as a safety net.
 */
export {
  PASSWORD_MAX,
  PASSWORD_MIN,
  passwordSchema,
} from '@cadence/shared/password';
