const API_URL = 'http://localhost:5000/search/spb/3/'

const app = new Vue({
	el: "#app",
	data: {
		loading: false,
		keyword:"",
		activeKeyword : null,
		keywords: [],
		activeResults: [],
		hiddenResults: {}
	},
	mounted() {
		if(localStorage.keywords){
			this.keywords = JSON.parse(localStorage.keywords);
		}

		if(localStorage.hiddenResults){
			this.hiddenResults = JSON.parse(localStorage.hiddenResults);
		}
	},
	methods: {
		clearHiddenResults(){
			this.hiddenResults = {};
			localStorage.hiddenResults = JSON.stringify(this.hiddenResults);
		},
		clearAll(){
			this.keyword = "";
			this.activeKeyword = null;
			this.keywords = [];
			this.activeResults = [];
			localStorage.keywords = JSON.stringify(this.keywords);
		},
		removeKeyword(keyword){
			const index = this.keywords.indexOf(keyword);
			this.keywords.splice(index, 1);
			this.activeResults = [];
			this.activeKeyword = '';
			localStorage.keywords = JSON.stringify(this.keywords);
		},
		hideResult(result){
			this.$set(this.hiddenResults, result.link, true);
			localStorage.hiddenResults = JSON.stringify(this.hiddenResults);
		},
		addKeyword(){
			if(this.keyword.length !== 0){
				this.keywords.push(this.keyword);
				localStorage.keywords = JSON.stringify(this.keywords);
			};
		},
		setActiveKeyword(keyword){
			this.activeResults = [];
			this.activeKeyword = keyword;
			this.loading = true;
			const url = `${API_URL}${keyword}`;
			fetch(url)
				.then(response => response.json())
				.then(json => {
					this.activeResults = json.results;
					this.loading = false;
				})
		}
	}
})
