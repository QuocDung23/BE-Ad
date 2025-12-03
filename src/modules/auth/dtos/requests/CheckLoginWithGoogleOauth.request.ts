import { socialAccountsWithPartialRelations } from '@/models';

export class CheckLoginWithGoogleOauthRequestDto {
	socialAccountInformation: socialAccountsWithPartialRelations;
}
