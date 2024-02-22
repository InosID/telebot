import gtranslate from "@iamtraction/google-translate";

export async function translate(message: string, language: string): Promise<string> {
  const { text } = await gtranslate(message, { to: language });
  return text;
}