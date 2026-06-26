'use server';

import { registerVisit } from '@/services/visits/register-visit';
import type { VisitRegistrationInput } from '@/services/visits/visit-registration-schema';

export type RegisterVisitActionState =
  | {
      ok: true;
      visitId: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function registerVisitAction(
  input: VisitRegistrationInput,
): Promise<RegisterVisitActionState> {
  try {
    const result = await registerVisit(input);

    return { ok: true, visitId: result.visitId };
  } catch (error) {
    console.error('Failed to register visit', error);

    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error desconocido al guardar la visita',
    };
  }
}
