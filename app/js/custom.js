export const listVectors = (divId, vectorsData,user,champUser,alliesGeneralList) => {
    const href = window.location.href;
    const host = href.split("?")[1].split("=")[1].replace("%3A%2F%2F", "://");
    const vectorsList = vectorsData?.length ? vectorsData?.map((vector) => {
            return `<div class="row">
                <div class="col-md-12">
                <div class="vector-detail-div">
                    <img class="vector-icon" src=${host+ vector?.Active_Logo} />
                    <h5 class="vector-title">${vector?.Vector_Name}</h5>
                </div>
                </div>
            </div>
            <div class="row gx-5">
                ${vector?.Allies?.length ? vector?.Allies?.map(ally =>{
                    return `
                        <div class="col-6">
                            <div class="p-5 pt-4 vendor-detail-div">
                                <img src=${host+ally?.Ally_Logo} class="vendor-img">
                                <h6 class="vendor-title">${ally?.Ally_Name}</h6>
                                <p class="vendor-desc">${ally?.Ally_Description}</p>
                                <a role="button" target="_blank" href=${`mailto:${champUser?.Email}?subject=${ally?.Ally_Name.split(" ").join("%20")}&body=${user?.Name?.display_value.split(" ").join("%20")}%20is%20requesting%20more%20information%20about%20${ally?.Ally_Name.split(" ").join("%20")}`} class="btn btn-outline-primary primary-btn">Inquire</a>
                            </div>
                        </div>
                    `
                }).join("") : `<div class="col-6"><p class="no-allies">No Allies Found</p></div>`}
            </div>`
    }).join("") : `<p class="no-data text-center">No Data Found</p>`;
    const generalList = alliesGeneralList ? `<div class="row">
                <div class="col-md-12">
                <div class="vector-detail-div">
                    <img class="vector-icon" src="assets/general.png" alt="" />
                    <h5 class="vector-title">General</h5>
                </div>
                </div>
            </div>
            <div class="row gx-5">
            ${alliesGeneralList?.length ? alliesGeneralList?.map(ally =>{
                    console.log(ally)
                    return `
                        <div class="col-6">
                            <div class="p-5 pt-4 vendor-detail-div">
                                <img src=${host+ally?.Ally_Logo} class="vendor-img">
                                <h6 class="vendor-title">${ally?.Ally_Name}</h6>
                                <p class="vendor-desc">${ally?.Ally_Description}</p>
                                <a role="button" target="_blank" href=${`mailto:${champUser?.Email}?subject=${ally?.Ally_Name.split(" ").join("%20")}&body=${user?.Name?.display_value.split(" ").join("%20")}%20is%20requesting%20more%20information%20about%20${ally?.Ally_Name.split(" ").join("%20")}`} class="btn btn-outline-primary primary-btn">Inquire</a>
                            </div>
                        </div>
                    `
                }).join("") : `<div class="col-6"><p class="no-allies">No Allies Found</p></div>`}
            </div>` : "";
    document.getElementById(divId).innerHTML = vectorsList + generalList;
}
  
