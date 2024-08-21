// This file contains the supported languages and their respective prompt building functions.
export const languages: Record<
	string,
	{ name: string; buildPrompt: (username: string, data: unknown) => string }
> = {
	english: {
		name: 'English',
		buildPrompt(username, data) {
			return `give a short and harsh roasting for the following github profile: ${username}. Here are the details: "${JSON.stringify(data)}"`;
		},
	},
	spanish: {
		name: 'Español (Spanish)',
		buildPrompt(username, data) {
			return `dar una crítica breve y dura del siguiente perfil de github: ${username}. Aquí están los detalles: "${JSON.stringify(data)}"`;
		},
	},
	france: {
		name: 'Français (French)',
		buildPrompt(username, data) {
			return `fais une courte et cruelle critique sarcastique en argot pour le profil GitHub suivant : ${username}. Voici les détails : "${JSON.stringify(data)}"`;
		},
	},
	italian: {
		name: 'Italiano (Italian)',
		buildPrompt(username, data) {
			return `Criticami in modo sarcastico il seguente profilo GitHub: ${username}. Ecco alcuni dettagli: "${JSON.stringify(data)}"`;
		},
	},
	indonesian: {
		name: 'Indonesian',
		buildPrompt(username, data) {
			return `gunakan bahasa indonesia yang normal seperti manusia gaul, berikan roasting singkat dengan kejam dan menyindir dalam bahasa gaul untuk profile github berikut : ${username}. Berikut detailnya: "${JSON.stringify(data)}"`;
		},
	},
	indian: {
		name: 'हिंदी (Hindi)',
		buildPrompt(username, data) {
			return `इस गिटहब प्रोफाइल के लिए एक क्रूर और व्यंग्यात्मक रोस्टिंग गली भाषा में दें: ${username}। विवरण इस प्रकार है: "${JSON.stringify(data)}"`;
		},
	},
	korean: {
		name: '한국어 (Korean)',
		buildPrompt(username, data) {
			return `다음 GitHub 프로필에 대해 잔인하고 비꼬는 짧은 로스팅을 속어로 해주세요: ${username}. 자세한 내용은 다음과 같습니다: "${JSON.stringify(data)}"`;
		},
	},
	japanese: {
		name: '日本語 (Japanese)',
		buildPrompt(username, data) {
			return `以下のGitHubプロフィールに対して残酷で皮肉な短いローストをギャル語でしてください: ${username}。詳細は次の通りです: "${JSON.stringify(data)}"`;
		},
	},
	chinese: {
		name: '中文 (Chinese)',
		buildPrompt(username, data) {
			return `用中文俚语对以下GitHub个人资料进行短暂而残酷的讽刺：${username}。以下是详细信息: "${JSON.stringify(data)}"`;
		},
	},
	german: {
		name: 'Deútsche (German)',
		buildPrompt(username, data) {
			return `machen sie eine grausame, kurze, harte und sarkastische Röstung auf Deutsch und verwenden Sie Wortspiele und Slang, um Humor in das folgende Github-Profil zu bringen : ${username}. Hier sind die Details : "${JSON.stringify(data)}"`;
		},
	},
	arabic: {
		name: 'العربية (Arabic)',
		buildPrompt(username, data) {
			return `.${JSON.stringify(data)}: اليك هذه التفصيل .${username} :(GitHub) قدم سخرية قصيرة و قاصية على الملف الشخصي في`;
		},
	},
	vietnamese: {
		name: 'Tiếng việt (Vietnamese)',
		buildPrompt(username, data) {
			return `Hãy đưa ra một lời châm chọc ngắn gọn và tàn nhẫn bằng tiếng lóng cho hồ sơ GitHub sau: ${username}. Đây là chi tiết: "${JSON.stringify(data)}"`;
		},
	},
	finnish: {
		name: 'Suomi (Finnish)',
		buildPrompt(username, data) {
			return `Kirjoita lyhyt, julma ja sarkastinen arvostelu slangilla seuraavalle Github-profiilille: ${username}. Tässä on profiilin yksityiskohdat: "${JSON.stringify(data)}"`;
		},
	},
	portuguese: {
		name: 'Português (Portuguese)',
		buildPrompt(username, data) {
			return `faça uma crítica curta e dura para o seguinte perfil do github: ${username}. Aqui estão os detalhes: "${JSON.stringify(data)}"`;
		},
	},
	polish: {
		name: 'język polski (Polish)',
		buildPrompt(username, data) {
			return `krótko i ostro skrytykuj poniższy profil GitHub: ${username}. Oto szczegóły: "${JSON.stringify(data)}"`;
		},
	},
	traditionalChinese: {
		name: '中文(臺灣) (Traditional Chinese)',
		buildPrompt(username, data) {
			return `請用正體中文及道地台灣俗語，對這個 GitHub 帳號殘酷地吐槽一番：${username}。以下是這個帳號的詳細資訊: "${JSON.stringify(data)}"`;
		},
	},
};
