
/** Скрывать "пейджер" если всё уместилось на одной странице */
const TURN_OFF_PAGER_FOR_ONE_PAGE = false;
// const TURN_OFF_PAGER_FOR_ONE_PAGE = true;

const MAX_COURSES_PER_PAGE = 10;
// const MAX_COURSES_PER_PAGE = 2;
const MAX_TUTORS_PER_PAGE = 10;
// const MAX_TUTORS_PER_PAGE = 2;

const apiBase = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/';
const apiKeyPostfix = '?api_key=667134bc-821e-4764-82b6-9949b611a421';


// Дожидаемся загрузки страницы, перед тем как что-то делать
const onIndexPageContentLoaded = async () => {

	// let coursesList = [];
	// try {
	//	const coursesResponse = await fetch(apiBase + 'courses' + apiKeyPostfix);
	// 	coursesList = await coursesResponse.json();
	// } catch (err) { /* Считаем, нет курсов */ }

	// let tutorsList = [];
	// try {
	//	const tutorsResponse = await fetch(apiBase + 'tutors' + apiKeyPostfix);
	// 	tutorsList = await tutorsResponse.json();
	// } catch (err) { /* Считаем, нет репетиторов */ }

	// Заглушка на время дебага, чтобы не делать бесконечные запросы к серверу
	const coursesList = [
		{
			"id": 1,
			"name": "Introduction to Russian language",
			"description": "A beginner course on Russian language learning.",
			"teacher": "Viktor Sergeevich",
			"level": "Beginner",
			"total_length": 8,
			"week_length": 2,
			"start_dates": [
				"2025-02-01T09:00:00",
				"2025-02-01T12:00:00",
				"2025-02-01T17:00:00",
				"2025-03-01T09:00:00",
				"2025-03-01T12:00:00",
				"2025-03-01T17:00:00"
			],
			"course_fee_per_hour": 200,
			"created_at": "2025-01-10T14:02:06.170310084",
			"updated_at": "2025-01-10T14:02:06.170348154"
		},
		{
			"id": 2,
			"name": "Advanced Spanish for Professionals",
			"description": "A comprehensive course for professionals looking to enhance their Spanish skills.",
			"teacher": "Luisa Martinez",
			"level": "Advanced",
			"total_length": 12,
			"week_length": 3,
			"start_dates": [
				"2025-02-10T10:00:00",
				"2025-02-10T14:00:00",
				"2025-02-10T18:00:00",
				"2025-03-10T10:00:00",
				"2025-03-10T14:00:00",
				"2025-03-10T18:00:00"
			],
			"course_fee_per_hour": 220,
			"created_at": "2025-01-13T00:43:50.548931002",
			"updated_at": "2025-01-13T00:43:50.549001188"
		},
		{
			"id": 3,
			"name": "French Conversation for Beginners",
			"description": "Learn basic French conversation skills in a fun environment.",
			"teacher": "Pierre Dupont",
			"level": "Beginner",
			"total_length": 6,
			"week_length": 2,
			"start_dates": [
				"2025-02-15T11:00:00",
				"2025-02-15T15:00:00",
				"2025-02-15T19:00:00",
				"2025-03-15T11:00:00",
				"2025-03-15T15:00:00",
				"2025-03-15T19:00:00"
			],
			"course_fee_per_hour": 180,
			"created_at": "2025-01-13T00:44:05.628034559",
			"updated_at": "2025-01-13T00:44:05.628071195"
		},
		{
			"id": 4,
			"name": "Japanese Language and Culture",
			"description": "An introductory course covering basic Japanese language and cultural nuances.",
			"teacher": "Akiko Tanaka",
			"level": "Beginner",
			"total_length": 10,
			"week_length": 2,
			"start_dates": [
				"2025-02-20T09:00:00",
				"2025-02-20T13:00:00",
				"2025-02-20T17:00:00",
				"2025-03-20T09:00:00",
				"2025-03-20T13:00:00",
				"2025-03-20T17:00:00"
			],
			"course_fee_per_hour": 250,
			"created_at": "2025-01-13T00:44:20.86891968",
			"updated_at": "2025-01-13T00:44:20.868958312"
		},
		{
			"id": 5,
			"name": "Italian Culinary Language Course",
			"description": "Master Italian culinary terms and expressions for cooking.",
			"teacher": "Marco Rossi",
			"level": "Beginner",
			"total_length": 8,
			"week_length": 1,
			"start_dates": [
				"2025-02-25T10:00:00",
				"2025-02-25T12:00:00",
				"2025-02-25T14:00:00",
				"2025-03-25T10:00:00",
				"2025-03-25T12:00:00",
				"2025-03-25T14:00:00"
			],
			"course_fee_per_hour": 210,
			"created_at": "2025-01-13T00:44:38.840262631",
			"updated_at": "2025-01-13T00:44:38.840284976"
		}
	];

	/** Группирует записи из start_dates по дате */
	const splitDateTimes = course => {
		const startDateTimes = course?.start_dates || [];

		const groupedDateTimes = startDateTimes.reduce((acc, dateTime) => {
			const date = dateTime.split('T')[0];
			const time = dateTime.split('T')[1];
			acc[date] ||= [];
			acc[date].push(time);

			return acc;
		}, {});

		course.grouped_date_times = groupedDateTimes;
	};

	coursesList.forEach(splitDateTimes);

	// Заглушка на время дебага, чтобы не делать бесконечные запросы к серверу
	const tutorsList = [
		{
			"id": 1,
			"name": "Irina Petrovna",
			"work_experience": 5,
			"languages_spoken": [
				"English",
				"Spanish",
				"Russian"
			],
			"languages_offered": [
				"Russian",
				"English"
			],
			"language_level": "Advanced",
			"price_per_hour": 500,
			"created_at": "2025-01-10T14:02:06.176121072",
			"updated_at": "2025-01-10T14:02:06.176134771"
		},
		{
			"id": 2,
			"name": "Viktor Sergeevich",
			"work_experience": 8,
			"languages_spoken": [
				"English",
				"German",
				"Russian"
			],
			"languages_offered": [
				"Russian",
				"German"
			],
			"language_level": "Advanced",
			"price_per_hour": 600,
			"created_at": "2025-01-13T00:57:07.280264163",
			"updated_at": "2025-01-13T00:57:07.28029533"
		},
		{
			"id": 3,
			"name": "Luisa Martinez",
			"work_experience": 4,
			"languages_spoken": [
				"Spanish",
				"Italian",
				"English"
			],
			"languages_offered": [
				"Spanish",
				"English"
			],
			"language_level": "Intermediate",
			"price_per_hour": 400,
			"created_at": "2025-01-13T00:57:38.285046293",
			"updated_at": "2025-01-13T00:57:38.285135355"
		},
		{
			"id": 4,
			"name": "Pierre Dupont",
			"work_experience": 6,
			"languages_spoken": [
				"French",
				"English"
			],
			"languages_offered": [
				"French",
				"English"
			],
			"language_level": "Intermediate",
			"price_per_hour": 550,
			"created_at": "2025-01-13T00:57:49.748410599",
			"updated_at": "2025-01-14T01:04:22.70980856"
		},
		{
			"id": 5,
			"name": "Akiko Tanaka",
			"work_experience": 3,
			"languages_spoken": [
				"Japanese",
				"English"
			],
			"languages_offered": [
				"Japanese",
				"English"
			],
			"language_level": "Advanced",
			"price_per_hour": 700,
			"created_at": "2025-01-13T00:58:05.224453269",
			"updated_at": "2025-01-13T00:58:05.224487682"
		},
		{
			"id": 6,
			"name": "Marco Rossi",
			"work_experience": 7,
			"languages_spoken": [
				"Italian",
				"French",
				"English"
			],
			"languages_offered": [
				"Italian"
			],
			"language_level": "Advanced",
			"price_per_hour": 620,
			"created_at": "2025-01-13T00:58:16.214494082",
			"updated_at": "2025-01-13T00:58:16.214539139"
		},
	];

	/** Показываем элементы */
	const reveal = (...elements) =>
		elements.forEach(element => element?.classList.remove('d-none'));

	/** Прячем элементы */
	const conceal = (...elements) =>
		elements.forEach(element => element?.classList.add('d-none'));

	/** Переключение цифровых кнопок "пейджера" */
	const vitalizePager = (pager, latest, switcher) => {
		const onClick = evt => {
			evt.preventDefault();

			const target = evt.target;
			const index = target.dataset['index'];

			if (index) {
				const numbered = [...pager.querySelector('ul').children]
					.map(li => li?.children[0]);

				const current = numbered.find(link =>
					link?.classList.contains('active'));

				const currentID = +current?.dataset['index'];

				if (currentID === +index) return;
				if ((currentID === 1) && (index === 'previous')) return;
				if ((currentID === latest) && (index === 'next')) return;

				numbered.forEach(link => link?.classList.remove('active'));

				if ((index === 'next') || (index === 'previous')) {
					const nextID = index === 'next' ? currentID + 1 : currentID - 1;

					const newActiveIndex =
						numbered.findIndex(link => +link?.dataset['index'] === nextID);

					numbered[newActiveIndex]?.classList.add('active');

					if (switcher) switcher(nextID);
					return;
				};

				target.classList.add('active');
				if (switcher) switcher(index);
			}
		};

		pager.addEventListener('click', onClick);
	};

	const numberOfPages = (len, max) => {
		const div = len / max;
		const rounded = Math.floor(div);

		return div === rounded ? rounded : rounded + 1;
	};

	/** Шаблон для формирования "пейджера" на основе общего количества записей 
	и максимального количества записей на странице */
	const paginationTemplate = (num, max, id = '') => {
		const di = id ? `id="${id}"` : '';

		const pagesNumber = numberOfPages(num, max);

		const paginationInner = [...Array(pagesNumber)]
			.map((noMatter, index) =>
				`<li class="page-item">
					<a class="page-link" data-index="${index + 1}" href="#">${index + 1}</a>
				</li>`)
			.join('\n');

		// Если набралось только на одну страницу, отключаем кнопки вперёд/назад
		const disabled = pagesNumber > 1 ? '' : 'disabled';

		const markup =
			`
				<ul ${di} class="pagination justify-content-center">
					<li class="page-item d-sm-none">
						<a class="page-link ${disabled}" href="#" data-index="previous"
							aria-label="Previous" 
							aria-disabled="${!!disabled}">

							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>

					<li class="page-item d-none d-sm-flex">
						<a class="page-link ${disabled}" href="#" data-index="previous"
							aria-disabled="${!!disabled}">

							Previous
						</a>
					</li>

					${paginationInner}

					<li class="page-item d-none d-sm-flex">
						<a class="page-link ${disabled}" href="#" data-index="next"
							aria-disabled="${!!disabled}">

							Next
						</a>
					</li>

					<li class="page-item d-sm-none">
						<a class="page-link ${disabled}" href="#" data-index="next"
							aria-label="Next"
							aria-disabled="${!!disabled}">

							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			`;

		return markup;
	};

	/** Формирует содержимое "страницы" - подмножество элементов */
	const getPageMarkup = (itemsList, perPage, pageNum = 1, request = 'course') => {
		const start = (pageNum - 1) * perPage;
		const end = start + perPage;

		const modalID = request === 'course'
			? 'requestCourseModal' : 'requestTutorModal';

		return itemsList.slice(start, end).map(item =>
			`<a href="#" data-id="${item.id}" 
				data-bs-toggle="modal" data-bs-target="#${modalID}" 
				data-bs-whatever="${item.id}"
				class="list-group-item list-group-item-action overflow-hidden">

				${item.name}
			</a>`)
			.join('\n');
	};

	/** ____ */
	// const vitalizePage = (page, clickHandler) => {};


	// Все существующие курсы с фильтрацией и без

	const filteredCoursesListBlock =
		document.getElementById('filtered-courses-list-block');

	const filteredCoursesListItself = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-itself');

	const noFilteredCoursesBanner = filteredCoursesListBlock
		?.querySelector('#no-filtered-courses-banner');

	const filteredCoursesListPagination = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-pagination');

	const filteredCoursesListHeader = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-header');

	filteredCoursesListBlock?.querySelector('.please-wait')?.remove();

	let filteredCoursesList = [...coursesList];

	const pagesNumber =
		numberOfPages(filteredCoursesList.length, MAX_COURSES_PER_PAGE);

	// Настраиваем пагинацию
	const tuneCoursesPagination = () => {
		if (!TURN_OFF_PAGER_FOR_ONE_PAGE || (pagesNumber !== 1))
			reveal(filteredCoursesListPagination);

		filteredCoursesListPagination.innerHTML =
			paginationTemplate(filteredCoursesList.length, MAX_COURSES_PER_PAGE);

		filteredCoursesListPagination.querySelector('[data-index="1"]')
			?.classList.add('active');
	};

	const showCoursesList = (pageNum = 1) => {
		reveal(filteredCoursesListItself);
		conceal(noFilteredCoursesBanner);

		filteredCoursesListItself.innerHTML =
			getPageMarkup(filteredCoursesList, MAX_COURSES_PER_PAGE, pageNum, 'course');
	};

	showCoursesList();
	tuneCoursesPagination();
	vitalizePager(filteredCoursesListPagination, pagesNumber, showCoursesList);

	// Обработчик нажатия на Search

	const onFilterCoursesFormSubmit = evt => {
		evt.preventDefault();

		const form = evt?.target;
		const name = form?.name.value || '';
		const level = form?.level.value || '';

		filteredCoursesList = coursesList
			.filter(course => !name || course.name.indexOf(name) !== -1)
			.filter(course => level === 'All' || level === course.level);

		reveal(filteredCoursesListBlock);

		if (!filteredCoursesList.length) {
			conceal(filteredCoursesListItself, filteredCoursesListPagination);
			reveal(noFilteredCoursesBanner);
		}

		if (filteredCoursesList.length) {
			filteredCoursesListHeader.innerHTML = 'Searched courses';
			showCoursesList();
			tuneCoursesPagination();
		}
	}

	const filterCoursesForm = document.getElementById('filter-courses-form');
	// Делаем кнопку доступной
	filterCoursesForm?.querySelector('.filter-course')?.removeAttribute('disabled');
	// Ставим обработчик отправки формы
	filterCoursesForm.addEventListener('submit', onFilterCoursesFormSubmit);


	// Что касается фильтрации репетиторов

	const filteredTutorsListBlock =
		document.getElementById('filtered-tutors-list-block');

	const filteredTutorsListItself = filteredTutorsListBlock
		?.querySelector('#filtered-tutors-list-itself');

	const noFilteredTutorsBanner = filteredTutorsListBlock
		?.querySelector('#no-filtered-tutors-banner');

	const filteredTutorsListPagination = filteredTutorsListBlock
		?.querySelector('#filtered-tutors-list-pagination');

	const filteredTutorsListHeader = filteredTutorsListBlock
		?.querySelector('#filtered-tutors-list-header');

	filteredTutorsListBlock?.querySelector('.please-wait')?.remove();

	let filteredTutorsList = [...tutorsList];

	const tutorsPagesNumber =
		numberOfPages(filteredTutorsList.length, MAX_TUTORS_PER_PAGE);

	// Настраиваем пагинацию
	const tuneTutorsPagination = () => {
		if (!TURN_OFF_PAGER_FOR_ONE_PAGE || (tutorsPagesNumber !== 1))
			reveal(filteredTutorsListPagination);

		filteredTutorsListPagination.innerHTML =
			paginationTemplate(filteredTutorsList.length, MAX_TUTORS_PER_PAGE);

		filteredTutorsListPagination.querySelector('[data-index="1"]')
			?.classList.add('active');
	};

	const showTutorsList = (pageNum = 1) => {
		reveal(filteredTutorsListItself);
		conceal(noFilteredTutorsBanner);

		filteredTutorsListItself.innerHTML =
			getPageMarkup(filteredTutorsList, MAX_TUTORS_PER_PAGE, pageNum, 'tutor');
	};

	const onTutorSelection = evt => {
		evt.preventDefault();

		const link = evt.target;
		const id = +link?.dataset['id'];

		if (!id) return;

		const entity = tutorsList.find(item => +item?.id === id);

		console.log(entity);
	};

	showTutorsList();
	filteredTutorsListItself.addEventListener('click', onTutorSelection);
	tuneTutorsPagination();
	vitalizePager(filteredTutorsListPagination, tutorsPagesNumber, showTutorsList);

	// Обработчик нажатия на Search

	const onFilterTutorsFormSubmit = evt => {
		evt.preventDefault();

		const form = evt?.target;
		const expa = +form?.expa.value || 0;
		const level = form?.level.value || '';

		const filteredTutorsList = tutorsList
			.filter(tutor => tutor.work_experience >= expa)
			.filter(tutor => level === 'Any' || level === tutor.language_level);

		reveal(filteredTutorsListBlock);

		if (!filteredTutorsList.length) {
			conceal(filteredTutorsListItself, filteredTutorsListPagination);
			reveal(noFilteredTutorsBanner);
		}

		if (filteredTutorsList.length) {
			filteredTutorsListHeader.innerHTML = 'Searched tutors';
			showTutorsList();
			tuneTutorsPagination();
		}
	}

	const filterTutorsForm = document.getElementById('filter-tutors-form');
	// Делаем кнопку доступной
	filterTutorsForm?.querySelector('.filter-tutor')?.removeAttribute('disabled');
	// Ставим обработчик отправки формы
	filterTutorsForm.addEventListener('submit', onFilterTutorsFormSubmit);
};

// Дожидаемся загрузки страницы, перед тем как что-то делать
document.addEventListener('DOMContentLoaded', onIndexPageContentLoaded);
