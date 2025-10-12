import { SendEmailDto } from './dtos';

import { MailConfig, MailTransportConfig } from '@/configs/mails.config';

export class MailsService {
	constructor() {}

	async sendEmail(data: SendEmailDto): Promise<{ success: boolean } | null> {
		const { sender, recipients, subject, html, text } = data;

		await MailTransportConfig.sendMail({
			from: sender || {
				address: MailConfig.senderAddress,
				name: MailConfig.senderName,
			},
			to: recipients,
			subject: subject,
			html: html,
			text: text,
		});
		return { success: true };
	}
}
