
import { listVectors } from "./custom.js";

ZOHO.CREATOR.init().then(async function (data) {
    var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
    const contentDiv = document.getElementById("category-data");
    contentDiv.innerHTML = `
    <div class="text-center loader-div">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    `;
    const attackvectorConfig =  {
        appName: "customer-portal",
        reportName: "All_Attack_Vectors",
        page: 1,
        pageSize: 200,
        ...(queryParams?.selectedAttackVectorID && {criteria: "(ID == " + queryParams?.selectedAttackVectorID + ")"})
    };
    const attackvendorConfig = {
        appName: "customer-portal",
        reportName: "Bluewire_Data_channels_Report",
        page: 1,
        pageSize: 200,
        criteria: '(Customer_Provider == false)',
    };
    const alliesListConfig = {
        appName: "customer-portal",
        reportName: "Bluewire_Allies",
        page: 1,
        pageSize: 200,
    };
    const alliesGeneralListConfig = {
        appName: "customer-portal",
        reportName: "Bluewire_Allies",
        page: 1,
        pageSize: 200,
        criteria: '(General == "Yes")'
    };
    
    var config = {
        appName: "customer-portal",
        reportName: "All_Users",
        page: 1,
        pageSize: 1,
        criteria: '(ID == ' + queryParams["loginUserEmail"] + ')',
    };
    const [user,alliesGeneralList, vectors, bluewireData,allies] = await Promise.all([
        ZOHO.CREATOR.API.getAllRecords(config).then((response) => {
            if(response?.data?.length){
                return response.data[0];
            }
        }),
        ZOHO.CREATOR.API.getAllRecords(alliesGeneralListConfig).then((response) => {
            if(response?.data){
                return response?.data;
            }
        }),
        ZOHO.CREATOR.API.getAllRecords(attackvectorConfig).then((response) => {
            if(response?.data){
                return response?.data;
            }
        }),
        ZOHO.CREATOR.API.getAllRecords(attackvendorConfig).then((response) => {
            if(response?.data){
                return response?.data
            }
        }),
        ZOHO.CREATOR.API.getAllRecords(alliesListConfig).then((response) => {
            if(response?.data){
                return response?.data
            }
        })
    ]);
    
    const companyConfig = {
        appName: "customer-portal",
        reportName: "All_Companies",
        page: 1,
        pageSize: 1,
        criteria: '(ID == ' + user?.Company?.ID + ')',
        }
    const company = await ZOHO.CREATOR.API.getAllRecords(companyConfig).then((response) => {
        if(response?.data?.length){
            return response.data[0];
        }
    });
    const championUserConfig = {
        appName: "customer-portal",
        reportName: "All_Users",
        page: 1,
        pageSize: 1,
        criteria: '(ID == ' + company?.Champion?.ID + ')',
    }
    const champUser = await ZOHO.CREATOR.API.getAllRecords(championUserConfig).then((response) => {
        if(response?.data?.length){
            return response.data[0];
        }
    });
    let newData = [];
    if(queryParams?.tagName){
        vectors.filter(vector => bluewireData.find(bluewire => {
            let alliesList = [];
            if(vector.ID === bluewire?.Reptile_Index_Theory_Attack_Vector?.ID){
                if(newData.some(el => el.ID === bluewire?.Reptile_Index_Theory_Attack_Vector?.ID)){
                    const index = newData.findIndex(item => item.ID === bluewire?.Reptile_Index_Theory_Attack_Vector?.ID);
                    allies?.find(ally => {
                        if(ally?.ID === bluewire?.Ally?.ID && bluewire?.Tags?.includes(queryParams?.tagName)){
                            newData[index].Allies.push(ally)
                        }
                    })
                }else{
                    allies?.find(ally => {
                        if(ally?.ID === bluewire?.Ally?.ID && bluewire?.Tags?.includes(queryParams?.tagName)){
                            alliesList.push(ally)
                        }
                    })
                    const data = {...vector,Allies:alliesList}
                    newData.push(data)
                }
            }
        }));
        const filteredData = newData.filter(item => item.Allies.length);
        newData = filteredData;

    }
    else{
        vectors.map(vector => {
            if(bluewireData.find(obj =>vector.ID  === obj?.Reptile_Index_Theory_Attack_Vector?.ID)){
                bluewireData.find(bluewire => {
                let alliesList = [];
                if(vector.ID === bluewire?.Reptile_Index_Theory_Attack_Vector?.ID){
                    if(newData.some(el => el.ID === bluewire?.Reptile_Index_Theory_Attack_Vector?.ID)){
                        const index = newData.findIndex(item => item.ID === bluewire?.Reptile_Index_Theory_Attack_Vector?.ID);
                        allies?.filter?.(ally => {
                            if(ally?.ID === bluewire?.Ally?.ID){
                                newData[index].Allies.push(ally)
                            }
                        });
                    }else{
                        allies?.filter?.(ally => {
                            if(ally?.ID === bluewire?.Ally?.ID){
                                alliesList.push(ally)
                            }
                        });
                        const data = {...vector,Allies:alliesList}
                        newData.push(data)

                    }
                }
            })
        }
        else{
            const data = {...vector}
            newData.push(data);
        }
        });

    }
    const reptileIndexData = newData?.filter(vector => vector.Select_Program === "Reptile Theory");
    const beyondComplianceData = newData?.filter(vector => vector.Select_Program === "Beyond Compliance");
    listVectors("category-data", newData,user, champUser,alliesGeneralList)
    listVectors("reptileIndex-data", reptileIndexData,user, champUser)
    listVectors("beyondCompliance-data", beyondComplianceData,user, champUser)

})