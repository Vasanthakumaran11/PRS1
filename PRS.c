#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <math.h> 

#define MAX_PRODUCTS 100
#define MAX_REVIEWS 50
#define MAX_STR_LEN 100
#define HASH_SIZE 50
#define MAX_HISTORY 50
#define MAX_CUSTOMERS 100

#define CUSTOMER_FILE "customers.txt"
#define CUSTOMER_DATA_DIR "customer_data/"

typedef struct {
    char customerID[MAX_STR_LEN];
    char review[MAX_STR_LEN];
    float rating;
} ReviewEntry;

typedef struct Product {
    char productID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
    ReviewEntry reviews[MAX_REVIEWS];
    int reviewCount;
    float avgRating;
    struct Product *next;
} Product;

typedef struct {
    char customerID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
} Customer;

Product *hashTable[HASH_SIZE] = {NULL};
Product *products[MAX_PRODUCTS];
int productCount = 0;

Customer customers[MAX_CUSTOMERS];
int customerCount = 0;

char searchHistory[MAX_HISTORY][MAX_STR_LEN];
int searchCount = 0;


// ------------------------ Utility Functions ------------------------

unsigned int hashFunc(const char *key) {
    unsigned int hash = 0;
    while (*key) {
        hash = (hash * 31 + *key) % HASH_SIZE;
        key++;
    }
    return hash;
}

void normalizeID(char *id) {
    for (int i = 0; id[i]; i++) {
        id[i] = toupper((unsigned char)id[i]);
    }
}


// ------------------------ Customer Persistence ------------------------

// Load all customers from file
void loadCustomers() {
    FILE *fp = fopen(CUSTOMER_FILE, "r");
    if (!fp) return; // File may not exist yet

    customerCount = 0;
    while (!feof(fp) && customerCount < MAX_CUSTOMERS) {
        char line[MAX_STR_LEN*2];
        if (fgets(line, sizeof(line), fp)) {
            line[strcspn(line, "\n")] = 0; // remove newline
            char *token = strtok(line, "|");
            if (token) strcpy(customers[customerCount].customerID, token);
            token = strtok(NULL, "|");
            if (token) strcpy(customers[customerCount].name, token);
            customerCount++;
        }
    }
    fclose(fp);
}

// Save a new customer to file
void saveCustomerToFile(Customer c) {
    FILE *fp = fopen(CUSTOMER_FILE, "a");
    if (!fp) return;
    fprintf(fp, "%s|%s\n", c.customerID, c.name);
    fclose(fp);
}

// Save a customer's review to their personal file
void saveCustomerProgress(char *customerID, char *productID, char *productName, float rating, char *review) {
    char filename[150];
    sprintf(filename, "%s%s.txt", CUSTOMER_DATA_DIR, customerID);

    FILE *fp = fopen(filename, "a"); // append mode
    if (!fp) {
        printf("Error opening progress file for customer %s!\n", customerID);
        return;
    }

    fprintf(fp, "%s|%s|%.2f|%s\n", productID, productName, rating, review);
    fclose(fp);
}

// Load and display customer's previous reviews
void loadCustomerProgress(char *customerID) {
    char filename[150];
    sprintf(filename, "%s%s.txt", CUSTOMER_DATA_DIR, customerID);

    FILE *fp = fopen(filename, "r");
    if (!fp) return; // No previous progress

    printf("\n--- Previous Reviews by %s ---\n", customerID);
    char line[300];
    while (fgets(line, sizeof(line), fp)) {
        line[strcspn(line, "\n")] = 0; // remove newline
        char *productID = strtok(line, "|");
        char *productName = strtok(NULL, "|");
        char *ratingStr = strtok(NULL, "|");
        char *review = strtok(NULL, "|");

        if (productID && productName && ratingStr && review) {
            printf("Product: %s (%s) | Rating: %s | Review: %s\n",
                   productName, productID, ratingStr, review);
        }
    }
    fclose(fp);
}


// ------------------------ Product Functions ------------------------

Product* findProduct(const char *productID) {
    unsigned int idx = hashFunc(productID);
    Product *p = hashTable[idx];
    while (p) {
        if (strcmp(p->productID, productID) == 0) return p;
        p = p->next;
    }
    return NULL;
}

void insertProduct(Product *p) {
    unsigned int idx = hashFunc(p->productID);
    p->next = hashTable[idx];
    hashTable[idx] = p;
}


// ------------------------ Customer Functions ------------------------

Customer* findCustomer(char *customerID) {
    for (int i = 0; i < customerCount; i++) {
        if (strcmp(customers[i].customerID, customerID) == 0) {
            return &customers[i];
        }
    }
    return NULL;
}

void addCustomer() {
    if (customerCount >= MAX_CUSTOMERS) {
        printf("Customer limit reached!\n");
        return;
    }

    char id[MAX_STR_LEN], name[MAX_STR_LEN];
    printf("New Customer ID: ");
    scanf("%s", id);
    normalizeID(id);

    if (findCustomer(id)) {
        printf("Customer ID already exists!\n");
        return;
    }

    printf("Enter Customer Name: ");
    scanf(" %[^\n]", name);

    strcpy(customers[customerCount].customerID, id);
    strcpy(customers[customerCount].name, name);
    saveCustomerToFile(customers[customerCount]);
    customerCount++;

    printf("Customer added successfully!\n");
}


// ------------------------ Review Functions ------------------------

void addProductReview(char *productID, char *name, char *customerID, float rating, char *review) {
    if (rating < 1.0 || rating > 5.0) {
        printf("Invalid rating! Must be between 1.0 and 5.0.\n");
        return;
    }

    normalizeID(productID);
    normalizeID(customerID);

    Customer *c = findCustomer(customerID);
    if (!c) {
        printf("Customer ID not found! Please add the customer first.\n");
        return;
    }

    Product *p = findProduct(productID);

    if (p) { 
        int customerReviewCount = 0;
        for (int i = 0; i < p->reviewCount; i++) {
            if (strcmp(p->reviews[i].customerID, customerID) == 0) {
                customerReviewCount++;
            }
        }

        if (customerReviewCount >= 1) {
            printf("Review already submitted.\n");
            return;
        }

        if (p->reviewCount >= MAX_REVIEWS) {
            printf("Max reviews reached.\n");
            return;
        }

        strcpy(p->reviews[p->reviewCount].customerID, customerID);
        strcpy(p->reviews[p->reviewCount].review, review);
        p->reviews[p->reviewCount].rating = rating;
        p->reviewCount++;

        float sum = 0.0;
        for (int i = 0; i < p->reviewCount; i++)
            sum += p->reviews[i].rating;
        p->avgRating = sum / p->reviewCount;

        printf("Review added by customer %s to existing product.\n", customerID);
    } else { 
        if (productCount >= MAX_PRODUCTS) {
            printf("Product limit reached.\n");
            return;
        }

        Product *newP = (Product *)malloc(sizeof(Product));
        strcpy(newP->productID, productID);
        strcpy(newP->name, name);
        newP->reviewCount = 1;
        strcpy(newP->reviews[0].customerID, customerID);
        strcpy(newP->reviews[0].review, review);
        newP->reviews[0].rating = rating;
        newP->avgRating = rating;
        newP->next = NULL;

        products[productCount++] = newP;
        insertProduct(newP);

        printf("First review by customer %s.\n", customerID);
        p = newP; // point p to new product for saving progress
    }

    // Save progress to customer_data/<CustomerID>.txt
    saveCustomerProgress(customerID, p->productID, p->name, rating, review);
}


// ------------------------ Product Search & Display ------------------------

void searchProduct() {
    char id[20];
    printf("Enter Product ID to search: ");
    scanf("%s", id);
    normalizeID(id);

    Product *p = findProduct(id);
    if (p) {
        printf("\nProduct Found:\n");
        printf("ID: %s | Name: %s | Avg Rating: %.2f\n", p->productID, p->name, p->avgRating);
        for (int i = 0; i < p->reviewCount; i++) {
            printf(" Customer: %s | %.2f★ - %s\n",
                   p->reviews[i].customerID,
                   p->reviews[i].rating,
                   p->reviews[i].review);
        }

        if (searchCount < MAX_HISTORY) {
            strcpy(searchHistory[searchCount++], id);
        }
    } else {
        printf("Product not found!\n");
    }
}

void displayTopRated() {
    int n;
    printf("Enter how many top-rated products to display: ");
    scanf("%d", &n);

    if (n <= 0 || n > productCount) {
        printf("Invalid number! Please enter a number between 1 and %d.\n", productCount);
        return;
    }

    for (int i = 0; i < productCount - 1; i++) {
        for (int j = 0; j < productCount - i - 1; j++) {
            if (products[j]->avgRating < products[j + 1]->avgRating) {
                Product *temp = products[j];
                products[j] = products[j + 1];
                products[j + 1] = temp;
            }
        }
    }

    printf("\n--- Top %d Rated Products ---\n", n);
    for (int i = 0; i < n; i++) {
        Product *p = products[i];
        printf("%d. ID: %s | Name: %s | Avg Rating: %.2f\n",
               i + 1,
               p->productID,
               p->name,
               p->avgRating);
    }
}


// ------------------------ Main ------------------------

int main() {
    int choice;
    char pid[MAX_STR_LEN], name[MAX_STR_LEN], review[MAX_STR_LEN], customerID[MAX_STR_LEN];
    float rating;

    loadCustomers(); 

    while (1) {
        printf("\n--- Login Required ---\n");
        printf("Enter Customer ID (or type NEW to register): ");
        scanf("%s", customerID);
        normalizeID(customerID);

        if (strcmp(customerID, "NEW") == 0) {
            addCustomer();  
            continue; 
        }

        Customer *loggedIn = findCustomer(customerID);
        if (!loggedIn) {
            printf("Customer not found! Please add as new customer.\n");
            continue;
        }

        printf("\nWelcome, %s (ID: %s)\n", loggedIn->name, loggedIn->customerID);

        // Load previous progress
        loadCustomerProgress(loggedIn->customerID);

        while (1) {
            printf("\n--- Product Rating & Review System ---\n");
            printf("1. Add Rating & Review\n2. Search Product\n3. Display Top Rated\n4. Logout\nChoice: ");
            scanf("%d", &choice);

            switch (choice) {
                case 1: {
                    printf("Enter Product ID: ");
                    scanf("%s", pid);
                    normalizeID(pid);

                    Product *existingProduct = findProduct(pid);

                    if (existingProduct) {
                        printf("Product found: %s\n", existingProduct->name);
                        strcpy(name, existingProduct->name); 
                    } else {
                        printf("Enter Product Name: ");
                        scanf(" %[^\n]", name);
                    }

                    printf("Enter Rating (1.0-5.0): ");
                    scanf("%f", &rating);

                    char choiceYN;
                    printf("Do you want to add a review? (Y/N): ");
                    scanf(" %c", &choiceYN);

                    if (choiceYN == 'N' || choiceYN == 'n') {
                        strcpy(review, "No review provided.");
                    } else {
                        printf("Enter Review: ");
                        scanf(" %[^\n]", review);
                    }

                    addProductReview(pid, name, loggedIn->customerID, rating, review);
                    break;
                }

                case 2:
                    searchProduct();
                    break;

                case 3:
                    displayTopRated();
                    break;

                case 4:
                    printf("Logged out\n");
                    goto logout; 

                default:
                    printf("Invalid choice.\n");
            }
        }
        logout:;
    }

    for (int i = 0; i < productCount; i++) free(products[i]);
    return 0;
}
