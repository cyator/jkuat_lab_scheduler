interface Auth {
	Authorization: string;
}

const authHeader = () => {
	let user;
	const res = localStorage.getItem('user') ?? '';
	if (res) {
		user = JSON.parse(res);
	}
	if (user && user.token) {
		return {
			Authorization: `Bearer ${user.token}`,
		} as Auth;
	} else {
		return {};
	}
};
export default authHeader;
