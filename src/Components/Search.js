import React, {useState } from 'react';
import '../App.css';
import 'semantic-ui-css/semantic.min.css'
import { Dropdown, Input, Card } from 'semantic-ui-react'
import { Loader } from 'semantic-ui-react'
import {Paginate} from './Paginate'

export function Search() {

    const [data,changeData] = useState([])//данные с ссылки
    const [fetching,changeFetching] = useState(false)//процесс загрузки

    const [count,changeCount] = useState(10)//количество элементов на странице
    const [options] = useState([//опции для downDrop Input
        { key: 'ten', text: '10', value: '10'},
        { key: 'twenty', text: '20', value: '20' },
        { key: 'thirty', text: '50', value: '50' }
    ])

//////////////////////////////////////////////
//Пагинация
    let totalCount = data.length;//всего элементов
    //let perPage = count;//элементы на 1 странице
    let paigeCount = Math.ceil(totalCount / count);//количество цифр пагинации

    const [offSet,setOffSet] = useState(0)//смещение для выбора элементов выбранная нами цифра на пагинации
    const [currentPaige,setcurrentPaige] = useState(0)//текущая страница
    const [sliceData,setSliceData] = useState([])

    let handlePageClick = (dataPagination) => {
      const selectedPagination = dataPagination.selected//получили инфу о порядковом номере цифры пагинации
      const offsetPagination = selectedPagination*count//количество пропущенных элементов
      setcurrentPaige(selectedPagination)//изменили текущую страницу / номер пагинации
      setOffSet(offsetPagination)//обновили состояние количества пропущеных item из data
      setSliceData(data.slice(offsetPagination,offsetPagination+count))//обновили состояние обрезанной data
    }
/////////////////////////////////////////////////////

    const wait = (ms)=>{//функция искуственной задержки
        return new Promise(resolve=>setTimeout(resolve,ms))
    }

    const getData = async()=>{//функция обращения по ссылке
        try {
            changeFetching(true)//начало загрузки
            await wait(1000) 
            let response = await fetch('https://restcountries.eu/rest/v2/all')
            response = await response.json()
            changeFetching(false)//конец загрузки
            return response//возвращаем массив
        } catch (error) {
            console.log(error.message)
        }
    }

    const changeHandler = async(e)=>{//при ввоже текста пользователем

        let text = e.target.value//текст введенный пользователем

        if(!text){//если текстовое поле пустое, то обнулить состояние data
            changeData([])//обнулить состояние data
            setSliceData([])
            return
        }

        let getedArr = await getData()//делаем запрос по ссылке и записываем ответ сюда
        let filtered = getedArr.filter(item=>{//фильтруем массив по именам 
            return item['name'].toLowerCase().includes(text.toLowerCase())//фильр по совпадению по введенному тексту
        })
          
        changeData(filtered)//обновляем состояние
        setSliceData(filtered.slice(offSet,offSet+count))//режим нужныйй кусок для отображения
    }

    const LoaderExampleInlineCentered = () => <Loader active inline='centered' className='activete'/>

    //name  region population

    const List = ()=> {

        if(sliceData){//если данные есть (найденно)

            if(fetching){//если идет загрузка то отображать loader
                return(
                    <LoaderExampleInlineCentered />
                )
            }

            return(
                <Card.Group>
                    {sliceData.map((item,i)=>{
                        return(
                            <Card 
                                header={item.name}
                                meta={item.region}
                                description={item.population}
                                key={i}
                            />
                        )
                    })}
                </Card.Group>
            )
        }

    return(//по дефолту пустой див
            <div>

            </div>
        )
    }

    //при выборе количества названий на странице
    const change_drop = async(e)=>{
        e.preventDefault()
        let x = 0;
        if(e.target.tagName === 'DIV'){
            let dom_target = e.target
            let child = dom_target.children[0]
            let value = +child.textContent//значение в диве-спане
            x=value
            changeCount(value)//изменили defaultValue
        }
        if(e.target.tagName === 'SPAN'){
            let child = e.target
            let value = +child.textContent//значение в спане
            x=value
            changeCount(value)//изменили defaultValue
        }
        setSliceData(sliceData.slice(offSet,offSet+x))//поменять кол-во названий стран т.к x=value=count изменился
    }

  return (
    <div className='Search'>
      <Input
          action={
            <Dropdown button basic floating options={options} defaultValue={`${count}`} onChange={e=>change_drop(e)}/>//count- defaultValue которое получаем со спана
          }
          icon='search'
          iconPosition='left'
          placeholder='Search...'
          onChange={changeHandler}
        />
      <Paginate paigeCount={paigeCount} currentPaige={currentPaige} handlePageClick={handlePageClick}/>
      <List />
    </div>
  );
}

export default Search;