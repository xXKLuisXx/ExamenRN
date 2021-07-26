/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, Component} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Alert,
  FlatList,
  useColorScheme,
  View,
  Pressable,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const List = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [list, setList] = useState([]);
  const [method, setMethod] = useState('');

  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [clasificacion, setClasificacion] = useState('');
  const [precio, setPrecio] = useState('');

  const clearInputs = () => {
    setNombre('');
    setMarca('');
    setModelo('');
    setClasificacion('');
    setPrecio('');
  };

  const openAddModal = () => {
    clearInputs();
    setMethod('add');
    setModalVisible(true);
  };

  const openUpdateModal = (
    id,
    nombre,
    marca,
    modelo,
    clasificacion,
    precio,
  ) => {
    clearInputs();
    setMethod('update');
    setId(id);
    setNombre(nombre);
    setMarca(marca);
    setModelo(modelo);
    setClasificacion(clasificacion);
    setPrecio(precio);
    setModalVisible(true);
  };

  const getProducts = () => {
    return new Promise((resolve, reject) => {
      fetch('http://192.168.100.21:8000/api/products', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const addProduct = () => {
    console.log("entra add");
    if (parseFloat(precio) > 0 && nombre && marca && modelo && clasificacion) {
      console.log("nuevo");
      fetch('http://192.168.100.21:8000/api/products', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          marca: marca,
          modelo: modelo,
          clasificacion: clasificacion,
          precio: precio,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);

          let temp = list;
          for (let index = 0; index < temp.length; index++) {
            console.log(index);
            if(!(index >= temp.length)){
              if(data.precio > list[index].precio &&  data.precio < list[index+1].precio) {
                console.log(data.precio, list[index].precio, list[index+1].precio)
                //console.log("entra");
                list.splice(index+1, 0, data);
                index = temp.length;
              }else {
                console.log("Aun no se inserta");
              }
            }else {
              console.log("Index llego al final");
            }
          }
          setModalVisible(false);
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error');
        })
        .finally(() => {
          clearInputs();
        });
    } else {
      Alert.alert('Algun campo incorrecto');
    }
  };

  const updateProduct = id => {
    if (parseFloat(precio) > 0 && nombre && marca && modelo && clasificacion) {
      fetch('http://192.168.100.21:8000/api/products/' + id, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          marca: marca,
          modelo: modelo,
          clasificacion: clasificacion,
          precio: precio,
        }),
      })
        .then(response => response.json())
        .then(data => {
          let index = list.findIndex(product => product.id == data.id);
          if (index != null) {
            console.log('entra');
            list.splice(index, 1, data);
          }
          setModalVisible(false);
        })
        .catch(error => {
          console.error(error);
          Alert.alert('Error');
        })
        .finally(() => {
          clearInputs();
        });
    } else {
      Alert.alert('Algun campo incorrecto');
    }
  };

  const deleteProduct = id => {
    fetch('http://192.168.100.21:8000/api/products/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let index = list.findIndex(product => product.id == data.id);
        if (index != null) {
          console.log('entra');
          list.splice(index, 1);
          console.log(list);
        }
        setMethod(data.id);
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error');
      })
      .finally(() => {
        clearInputs();
      });
  };

  useEffect(() => {
    getProducts()
      .then(data => {
        setList(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View style={{padding: 10}}>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => {
          openAddModal();
        }}>
        <Text style={styles.textStyle}>Nuevo</Text>
      </Pressable>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
              <View style={[styles.formView]}>
                <TextInput
                  style={{height: 40}}
                  placeholder="Nombre"
                  onChangeText={nombre => setNombre(nombre)}
                  defaultValue={nombre}
                />
                <TextInput
                  style={{height: 40}}
                  placeholder="Marca"
                  onChangeText={marca => setMarca(marca)}
                  defaultValue={marca}
                />
                <TextInput
                  style={{height: 40}}
                  placeholder="Modelo"
                  onChangeText={modelo => setModelo(modelo)}
                  defaultValue={modelo}
                />
                <TextInput
                  style={{height: 40}}
                  placeholder="Clasificacion"
                  onChangeText={clasificacion =>
                    setClasificacion(clasificacion)
                  }
                  defaultValue={clasificacion}
                />
                <TextInput
                  style={{height: 40}}
                  placeholder="Precio"
                  keyboardType="numeric"
                  onChangeText={precio =>
                    setPrecio(
                      parseFloat(precio) ? parseFloat(precio).toString() : '0',
                    )
                  }
                  defaultValue={precio}
                />
                <Pressable
                  style={[styles.button, styles.buttonOpen]}
                  onPress={
                    method == 'update'
                      ? () => updateProduct(id)
                      : () => addProduct()
                  }>
                  <Text style={styles.textStyle}>
                    {method == 'update' ? 'Actualizar' : 'Agregar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.first_box}>
            <Text style={styles.text_id}>ID</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Nombre</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Marca</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Modelo</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Clasificacion</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>Precio</Text>
          </View>
          <View style={styles.last_box}>
            <Text style={styles.text}>Opciones</Text>
          </View>
        </View>
        <FlatList
          data={list}
          renderItem={({item}) => (
            <View style={styles.item}>
              <View style={styles.first_box}>
                <Text style={styles.text_id}>{item.id}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>{item.nombre}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>{item.marca}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>{item.modelo}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>{item.clasificacion}</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.text}>{item.precio}</Text>
              </View>
              <View style={styles.last_box}>
                <Pressable
                  style={[styles.button, styles.buttonUpdate]}
                  onPress={() => {
                    openUpdateModal(
                      item.id,
                      item.nombre,
                      item.marca,
                      item.modelo,
                      item.clasificacion,
                      item.precio,
                    );
                  }}>
                  <Text style={styles.textStyle}>Actualizar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonDelete]}
                  onPress={() => {
                    deleteProduct(item.id)
                  }}>
                  <Text style={styles.textStyle}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  item: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'powderblue',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  first_box: {
    width: '5%',
    height: 'auto',
    borderRightWidth: 1,
  },
  box: {
    width: '14%',
    height: 'auto',
    borderRightWidth: 1,
  },
  last_box: {
    width: '25%',
    height: 'auto',
    borderRightWidth: 1,
  },
  text_id: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  font: {
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  formView: {
    width: '100%',
    margin: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    alignSelf: 'flex-end',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
