
const onIndexPageContentLoaded = async () => {

	/** Скрывать "пейджер" если всё уместилось на одной странице */
	const TURN_OFF_PAGER_FOR_ONE_PAGE = false;
	// 
	const MAX_COURSES_PER_PAGE = 10;
	// const MAX_COURSES_PER_PAGE = 2;
	// const MAX_FILTERED_COURSES_PER_PAGE = 2;
	const MAX_FILTERED_COURSES_PER_PAGE = 10;

	const apiBase = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api/';
	const apiKeyPostfix = '?api_key=667134bc-821e-4764-82b6-9949b611a421';

	const coursesResponse = await fetch(apiBase + 'courses' + apiKeyPostfix);

	let _coursesList = [];
	try {
		_coursesList = await coursesResponse.json();
	} catch (err) { /* Считаем, нет курсов */ }

		// Заглушка для дебага
	const __oursesList = [
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

	// Заглушка
	const _tutorsList = [
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

	const reveal = (...elements) =>
		elements.forEach(element => element?.classList.remove('d-none'));

	const conceal = (...elements) =>
		elements.forEach(element => element?.classList.add('d-none'));

	const vitalizePager = pager => {
		const onClick = evt => {
			evt.preventDefault();

			const target = evt.target;
			const index = target.dataset['index']

			if (index) {
				const numbered = [...pager.querySelector('ul').children];

				numbered.forEach(button =>
					button?.children[0]?.classList.remove('active'));

				target.classList.add('active');
			}
		};

		pager.addEventListener('click', onClick);
	};

	/** Шаблон для формирования "пейджера" на основе общего количества записей 
	и максимального количества записей на странице */
	const paginationTemplate = (num, max, id = '') => {
		const di = id ? `id="${id}"` : '';

		const pagesNumber = Math.floor(num / max) + 1;

		const paginationInner = [...Array(pagesNumber)]
			.map((noMatter, index) =>
				`<li class="page-item">
					<a class="page-link" data-index="${index + 1}" href="#">${index + 1}</a>
				</li>`)
			.join('\n');

		// Если набралось только на одну страницу, отключаем кнопки вперёд/назад
		const disabled = pagesNumber > 1 ? '' : 'disabled';
		// Можно обойтись
		// const tabindexNegative= disabled ? 'tabindex = -1' : '';

		const markup =
			`
				<ul ${di} class="pagination justify-content-center">
					<li class="page-item d-sm-none">
						<a class="page-link ${disabled}" href="#" aria-label="Previous" 
						aria-disabled="${!!disabled}">
							<span aria-hidden="true">&laquo;</span>
						</a>
					</li>

					<li class="page-item d-none d-sm-flex">
						<a class="page-link ${disabled}" href="#" aria-disabled="${!!disabled}">
							Previous
						</a>
					</li>

					${paginationInner}

					<li class="page-item d-none d-sm-flex">
						<a class="page-link ${disabled}" href="#" aria-disabled="${!!disabled}">
							Next
						</a>
					</li>

					<li class="page-item d-sm-none">
						<a class="page-link ${disabled}" href="#" aria-label="Next"
						aria-disabled="${!!disabled}">
							<span aria-hidden="true">&raquo;</span>
						</a>
					</li>
				</ul>
			`;

		return markup;
	};

	const coursesListBlock = document.getElementById('courses-list-block');
	const coursesListItself = coursesListBlock?.querySelector('#courses-list-itself');

	const coursesListPagination = coursesListBlock
		?.querySelector('#courses-list-pagination');

	coursesListBlock?.querySelector('.please-wait')?.remove();

	if (!_coursesList.length)
		coursesListBlock?.querySelector('#no-courses-found-banner')
			?.classList.remove('d-none');

	if (_coursesList?.length) {
		coursesListItself?.classList.remove('d-none');

		coursesListItself.innerHTML = _coursesList.map(courseItem =>
			`<a href="#" class="list-group-item list-group-item-action overflow-hidden">
				${courseItem.name}
			</a>`)
			.join('\n');

		// coursesListItself.firstChild.classList.add('active');

		// Настраиваем пагинацию

		if (!TURN_OFF_PAGER_FOR_ONE_PAGE || (coursesListPagesNumber !== 1))
			coursesListPagination?.classList.remove('d-none');

		coursesListPagination.innerHTML =
			paginationTemplate(_coursesList.length, MAX_COURSES_PER_PAGE);

		coursesListPagination.querySelector('[data-index="1"]')
			?.classList.add('active');
	}

	const teachersOfCourseses = [...new Set(_coursesList.map(course => course.teacher))];

	// filter-courses

	const filteredCoursesListBlock =
		document.getElementById('filtered-courses-list-block');

	const filteredCoursesListItself = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-itself');

	const noFilteredCoursesBanner = filteredCoursesListBlock
		?.querySelector('#no-filtered-courses-banner');

	const filteredCoursesListPagination = filteredCoursesListBlock
		?.querySelector('#filtered-courses-list-pagination');

	vitalizePager(filteredCoursesListPagination);

	const onFilterCoursesFormSubmit = evt => {
		evt.preventDefault();

		const form = evt?.target;
		const name = form?.name.value || '';
		const level = form?.level.value || '';

		const filteredCoursesList = _coursesList
			.filter(course => !name || course.name.indexOf(name) !== -1)
			.filter(course => level === 'All' || level === course.level);

		reveal(filteredCoursesListBlock);
		filteredCoursesListBlock?.classList.add('d-flex');

		if (!filteredCoursesList.length) {
			conceal(filteredCoursesListItself, filteredCoursesListPagination);
			reveal(noFilteredCoursesBanner);
		}

		if (filteredCoursesList.length) {
			reveal(filteredCoursesListItself, filteredCoursesListPagination);
			conceal(noFilteredCoursesBanner);

			filteredCoursesListItself.innerHTML = filteredCoursesList.map(courseItem =>
				`<a href="#" class="list-group-item list-group-item-action overflow-hidden">
					${courseItem.name}
				</a>`)
				.join('\n');

			// filteredCoursesListItself.firstChild.classList.add('active');

			// Настраиваем пагинацию

			filteredCoursesListPagination.innerHTML =
				paginationTemplate(filteredCoursesList.length, MAX_FILTERED_COURSES_PER_PAGE);

			filteredCoursesListPagination.querySelector('[data-index="1"]')
				?.classList.add('active');
		}


	}

	const filterCoursesForm = document.getElementById('filter-courses-form');
	filterCoursesForm?.querySelector('.filter-course')?.removeAttribute('disabled');
	filterCoursesForm.addEventListener('submit', onFilterCoursesFormSubmit)










};

document.addEventListener('DOMContentLoaded', onIndexPageContentLoaded);
