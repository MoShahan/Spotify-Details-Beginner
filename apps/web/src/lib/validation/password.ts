/**
 * Register password validation for the web app (RHF + Zod).
 * Same rules as the API (`@cadence/shared`) - UI blocks submit first;
 * backend still re-validates if a request bypasses the form.
 */
export {
  PASSWORD_MAX,
  PASSWORD_MIN,
  passwordSchema,
} from '@cadence/shared/password';
