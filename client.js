const API_URL = 'http://localhost:5000/search/spb/3/'

Vue.component('modal', {
	props:['title', 'employer', 'salary', 'responsibility', 'requirement', 'address', 'date'],
  template:`<transition name="modal">
				    <div class="modal-mask">
				      <div class="modal-wrapper">
								<div class="modal-dialog modal-dialog-scrollable" role="document">
								    <div class="modal-content">
								      <div class="modal-header">
								        <h5 class="modal-title">{{ title }}</h5>
								        <button @click="$emit('close')" type="button" class="close" data-dismiss="modal" aria-label="Close">
								          <span aria-hidden="true">&times;</span>
								        </button>
								      </div>
								      <div class="modal-body">
												<p>Вакансия компании <a :href="employer.link">{{employer.name}}</a> <br> от {{date}}:</p>
												<p>Описание: <br>
													{{responsibility}}
												</p>
												<p>
													Требования: <br>
													{{requirement}}
												</p>
												<p></p>
								      </div>
								      <div class="modal-footer">
								        <button type="button" class="btn btn-secondary"  data-dismiss="modal">Close</button>
								        <button type="button" class="btn btn-primary">Save changes</button>
								      </div>
								    </div>
								  </div>
				      </div>
				    </div>
				  </transition>`
});

const app = new Vue({
	el: "#app",
	data: {
		showModal: false,
		loading: false,
		keyword:"",
		activeKeyword : null,
		keywords: [],
		activeResults: [],
		hiddenResults: {},
		modalData: {
			title: "",
			salary: "",
			link: "",
			responsibility: "",
			requirement: "",
			employer: {
				name: "",
				link: ""
			},
			address: "",
			date: ""
		}
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
		openModal(result){
			this.modalData = result;
			this.$nextTick(function () {
        this.showModal = true;
      })

		},
		updateMessage: async function (result) {
	    this.modalData = result;
	    await this.$nextTick()
	    this.showModal = true;
  	},
		getIndexOfResult(result){
			return this.activeResults.indexOf(result);
		},
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

				//make tab active if there is none
				if(this.activeKeyword.length < 1 || this.activeKeyword.length == null){
					this.setActiveKeyword(this.keyword)
				}
				this.keyword = "";
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
