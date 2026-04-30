export function createUsernameFromEmail(email: string) {
  const userName = email.split("@")[0];
  const userNamePascalCase = userName.at(0)?.toUpperCase() + userName.slice(1);

  return userNamePascalCase;
}
